import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { X, Search, LucideAngularModule } from 'lucide-angular';
import {Appointment} from '../../../../model/appointment.model';
import {UserService} from '../../../../../user/services/user.service';
import {User} from '../../../../../user/model/user.model';

@Component({
  selector: 'app-task-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './task-assignment.component.html',
  styleUrls: ['./task-assignment.component.css']
})
export class TaskAssignmentComponent implements OnInit {
  constructor(
    private userService: UserService
  ) {}

  @Input() appointment: Appointment | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  mechanics: User[] = [];
  serviceAssignments: Map<string, string[]> = new Map();
  activeDropdownServiceId: string | null = null;
  searchQuery: string = '';

  ngOnInit() {
    if (this.appointment) {
      this.appointment.services.forEach(service => {
        if (!this.serviceAssignments.has(service._id)) {
          this.serviceAssignments.set(service._id, []);
        }
      });
    }
    this.fetchMechanics().then();
  }

  async fetchMechanics() {
    this.userService.getUsersByRole("MECHANIC").subscribe({
      next: (data) => {
        this.mechanics = data.data;
      }
    });
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
    console.log('Assignments saved:', Object.fromEntries(this.serviceAssignments));
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  protected readonly X = X;
  protected readonly Search = Search;
}
