import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { LucideAngularModule, Search, X } from 'lucide-angular'
import { Appointment, STATUS } from '../../model/appointment.model'
import { UserService } from '../../../user/services/user.service'
import { User } from '../../../user/model/user.model'
import { TaskService } from '../../../task/services/task.service'
import { TASK_STATUS, TaskDto } from '../../../task/model/task.model'
import { UtilsService } from '../../../../shared/utils/utils.service'
import { catchError, map, Observable, take, throwError } from 'rxjs'

@Component({
  selector: 'app-task-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './task-assignment.component.html',
  styleUrls: ['./task-assignment.component.css']
})
export class TaskAssignmentComponent implements OnInit, OnChanges {
  private userService = inject(UserService);
  private taskService = inject(TaskService);
  protected utilsService = inject(UtilsService);

  @Input() appointment: Appointment | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() tasksUpdated = new EventEmitter<any[]>();
  @Output() taskStatusUpdated = new EventEmitter<void>();
  availableStatuses: TASK_STATUS[] = Object.values(TASK_STATUS);

  mechanics = signal<User[]>([]);
  serviceStatuses = signal<Map<string, TASK_STATUS>>(new Map());
  serviceAssignments = signal<Map<string, string[]>>(new Map());
  activeDropdownServiceId = signal<string | null>(null);
  activeStatusDropdownServiceId = signal<string | null>(null);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);
  showErrorMessage = signal<boolean>(false);
  errorMessage = signal<string>('');


  ngOnInit() {
    if (this.appointment) {
      const assignmentsMap = new Map<string, string[]>();
      const statusesMap = new Map<string, TASK_STATUS>();
      this.appointment.services.forEach(service => {
        assignmentsMap.set(service._id, []);
        statusesMap.set(service._id, TASK_STATUS.PENDING);
      });
      this.serviceAssignments.set(assignmentsMap);
      this.serviceStatuses.set(statusesMap);
    }
    this.fetchMechanics();
  }

  ngOnChanges() {
    if (this.appointment?._id) {
      this.fetchExistingTasks(this.appointment._id);
    }
  }

  fetchExistingTasks(appointmentId: string) {
    this.taskService.getTasksByAppointment(appointmentId).subscribe({
      next: (data) => {
        const assignmentsMap = new Map<string, string[]>();
        const statusesMap = new Map<string, TASK_STATUS>();
        this.appointment?.services.forEach(service => {
          assignmentsMap.set(service._id, []);
          statusesMap.set(service._id, TASK_STATUS.PENDING);
        });

        data.data.forEach((task: TaskDto) => {
          assignmentsMap.set(task.service, task.users);
          statusesMap.set(task.service, task.status);
        });

        this.serviceAssignments.set(assignmentsMap);
        this.serviceStatuses.set(statusesMap);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  getTaskStatus(serviceId: string): TASK_STATUS {
    return this.serviceStatuses().get(serviceId) || TASK_STATUS.PENDING;
  }

  getUpdatedTask(appointmentId: string, serviceId: string): Observable<string> {
    return this.taskService.findTaskByAppointmentIdAndServiceId(appointmentId, serviceId)
      .pipe(
        map((data: any) => data.data._id),
        catchError((error) => {
          this.errorMessage.set('Statut impossible à modifier : Affectez d\'abord un mécanicien');
          this.showErrorMessage.set(true);
          return throwError(() => error);
        })
      );
  }

  fetchMechanics() {
    this.userService.getUsersByRole("MECHANIC").subscribe({
      next: (data) => {
        this.mechanics.set(data.data);
      }
    });
  }

  toggleDropdown(serviceId: string | null) {
    if (this.activeDropdownServiceId() === serviceId) {
      this.activeDropdownServiceId.set(null);
      this.searchQuery.set('');
    } else {
      this.activeDropdownServiceId.set(serviceId);
      this.searchQuery.set('');
    }
  }

  toggleStatusDropdown(serviceId: string, event: MouseEvent) {
    event.stopPropagation();
    if (this.activeStatusDropdownServiceId() === serviceId) {
      this.activeStatusDropdownServiceId.set(null);
    } else {
      this.activeStatusDropdownServiceId.set(serviceId);
    }
  }

  changeStatus(appointmentId: string, serviceId: string, newStatus: TASK_STATUS, event: MouseEvent) {
    event.stopPropagation();
    this.getUpdatedTask(appointmentId, serviceId)
      .pipe(take(1))
      .subscribe({
        next: (taskId) => {
          const statusesMap = new Map(this.serviceStatuses());
          statusesMap.set(serviceId, newStatus);
          this.serviceStatuses.set(statusesMap);
          const data: { [key: string]: any } = {
            status: newStatus,
          };
          if (newStatus === TASK_STATUS.IN_PROGRESS) {
            data['maintenance_start_time'] = new Date();
          } else if (newStatus === TASK_STATUS.IN_REVIEW) {
            data['review_start_time'] = new Date();
          } else if (newStatus === TASK_STATUS.COMPLETED) {
            data['finish_time'] = new Date();
            window.location.reload();
          }
          this.taskService.updateTask(taskId, data).subscribe({
              next: (data) => {
                this.taskStatusUpdated.emit();
              },
            });
          this.activeStatusDropdownServiceId.set(null);
        },
      });
  }
  assignMechanic(serviceId: string, mechanicId: string) {
    const currentMap = this.serviceAssignments();
    const currentAssignments = currentMap.get(serviceId) || [];

    if (!currentAssignments.includes(mechanicId)) {
      const newMap = new Map(currentMap);
      newMap.set(serviceId, [...currentAssignments, mechanicId]);
      this.serviceAssignments.set(newMap);
    }

    this.toggleDropdown(null);
  }

  removeMechanic(serviceId: string, mechanicId: string) {
    const currentMap = this.serviceAssignments();
    const currentAssignments = currentMap.get(serviceId) || [];

    const newMap = new Map(currentMap);
    newMap.set(
      serviceId,
      currentAssignments.filter(id => id !== mechanicId)
    );

    this.serviceAssignments.set(newMap);
  }

  getMechanicName(mechanicId: string): string {
    return this.mechanics().find(m => m._id === mechanicId)?.firstname || '';
  }

  getAssignedMechanics(serviceId: string): string[] {
    return this.serviceAssignments().get(serviceId) || [];
  }

  getFilteredMechanics(): User[] {
    return this.mechanics().filter(mechanic =>
      mechanic.firstname.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  }

  onSave() {
    if (!this.appointment) return;
    this.isLoading.set(true);
    const tasksToUpsert: any[] = [];
    const assignments = this.serviceAssignments();
    this.appointment.services.forEach(service => {
      const mechanicIds = assignments.get(service._id) || [];
      tasksToUpsert.push({
        appointment: this.appointment?._id!,
        service: service._id,
        users: mechanicIds,
      });
    });

    this.taskService.upsertMany(tasksToUpsert).subscribe({
      next: (response) => {
        this.tasksUpdated.emit(response.data);
        this.isLoading.set(false);
        this.close.emit();
      },
      error: (error) => {
        console.error('Erreur lors de la création ou mise à jour des tâches:', error);
        this.isLoading.set(false);
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  closeErrorMessage(): void {
    this.showErrorMessage.set(false);
  }

  protected readonly X = X;
  protected readonly Search = Search;
  protected readonly TASK_STATUS = TASK_STATUS
  protected readonly STATUS = STATUS
}
