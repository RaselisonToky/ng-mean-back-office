import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, X } from 'lucide-angular';
import { Appointment } from '../../model/appointment.model';
import { UserService } from '../../../user/services/user.service';
import { User } from '../../../user/model/user.model';
import { TaskService } from '../../../task/services/task.service';
import { TASK_STATUS, TaskDto } from '../../../task/model/task.model';

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

  @Input() appointment: Appointment | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() tasksUpdated = new EventEmitter<any[]>();

  // Utilisation de signaux pour l'état du composant
  mechanics = signal<User[]>([]);
  serviceAssignments = signal<Map<string, string[]>>(new Map());
  activeDropdownServiceId = signal<string | null>(null);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);

  ngOnInit() {
    if (this.appointment) {
      const assignmentsMap = new Map<string, string[]>();
      this.appointment.services.forEach(service => {
        if (!assignmentsMap.has(service._id)) {
          assignmentsMap.set(service._id, []);
        }
      });
      this.serviceAssignments.set(assignmentsMap);
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
        this.appointment?.services.forEach(service => {
          assignmentsMap.set(service._id, []);
        });

        data.data.forEach((task: TaskDto) => {
          assignmentsMap.set(task.service, task.users);
        });

        this.serviceAssignments.set(assignmentsMap);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
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
    const tasksToUpsert: TaskDto[] = [];
    const assignments = this.serviceAssignments();

    this.appointment.services.forEach(service => {
      const mechanicIds = assignments.get(service._id) || [];
      tasksToUpsert.push({
        appointment: this.appointment?._id!,
        service: service._id,
        users: mechanicIds,
        status: TASK_STATUS.PENDING
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

  protected readonly X = X;
  protected readonly Search = Search;
}
