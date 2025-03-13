import {Component, effect, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LucideAngularModule, Search, X} from 'lucide-angular';
import {Appointment} from '../../../../model/appointment.model';
import {UserService} from '../../../../../user/services/user.service';
import {User} from '../../../../../user/model/user.model';
import {TaskService} from '../../../../../task/services/task.service';
import {Task, TASK_STATUS, TaskDto} from '../../../../../task/model/task.model';

@Component({
  selector: 'app-task-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './task-assignment.component.html',
  styleUrls: ['./task-assignment.component.css']
})
export class TaskAssignmentComponent implements OnInit {
  constructor(
    private userService: UserService,
    private taskService: TaskService
  ) {}

  @Input() appointment: Appointment | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() tasksUpdated = new EventEmitter<any[]>();
  mechanics: User[] = [];
  serviceAssignments: Map<string, string[]> = new Map();
  activeDropdownServiceId: string | null = null;
  searchQuery: string = '';
  isLoading: boolean = false;

  ngOnInit() {
    if (this.appointment) {
      this.appointment.services.forEach(service => {
        if (!this.serviceAssignments.has(service._id)) {
          this.serviceAssignments.set(service._id, []);
        }
      });
    }
  }

  toggleDropdown(serviceId: string | null) {
    if (this.activeDropdownServiceId === serviceId) {
      this.activeDropdownServiceId = null;
      this.searchQuery = '';
    } else {
      this.activeDropdownServiceId = serviceId;
      this.searchQuery = '';
    }
  }

  assignMechanic(serviceId: string, mechanicId: string) {
    const currentAssignments = this.serviceAssignments.get(serviceId) || [];
    if (!currentAssignments.includes(mechanicId)) {
      this.serviceAssignments.set(serviceId, [...currentAssignments, mechanicId]);
    }
    this.toggleDropdown(null);
  }

  removeMechanic(serviceId: string, mechanicId: string) {
    const currentAssignments = this.serviceAssignments.get(serviceId) || [];
    this.serviceAssignments.set(
      serviceId,
      currentAssignments.filter(id => id !== mechanicId)
    );
  }

  getMechanicName(mechanicId: string): string {
    return this.mechanics.find(m => m._id === mechanicId)?.firstname || '';
  }

  getAssignedMechanics(serviceId: string): string[] {
    return this.serviceAssignments.get(serviceId) || [];
  }

  getFilteredMechanics(): User[] {
    return this.mechanics.filter(mechanic =>
      mechanic.firstname.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSave() {
    if (!this.appointment) return;

    this.isLoading = true;
    const tasksToUpsert: TaskDto[] = [];

    this.appointment.services.forEach(service => {
      const mechanicIds = this.serviceAssignments.get(service._id) || [];
      tasksToUpsert.push({
        appointment: this.appointment?._id? this.appointment._id: '',
        service: service._id,
        users: mechanicIds,
        status: TASK_STATUS.PENDING
      });
    });

    this.taskService.upsertMany(tasksToUpsert).subscribe({
      next: (response) => {
        console.log('Tâches créées ou mises à jour avec succès:', response);
        this.tasksUpdated.emit(response.data);
        this.isLoading = false;
        this.close.emit();
      },
      error: (error) => {
        console.error('Erreur lors de la création ou mise à jour des tâches:', error);
        this.isLoading = false;
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  protected readonly X = X;
  protected readonly Search = Search;
}
