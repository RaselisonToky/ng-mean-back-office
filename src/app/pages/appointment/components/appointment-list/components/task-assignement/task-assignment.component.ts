import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { X, User, Search, LucideAngularModule } from 'lucide-angular';
import {Appointment} from '../../../../model/appointment.model';

interface Mechanic {
  id: string;
  name: string;
  avatar?: string;
}

@Component({
  selector: 'app-task-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './task-assignment.component.html',
  styleUrls: ['./task-assignment.component.css']
})
export class TaskAssignmentComponent implements OnInit {
  @Input() appointment: Appointment | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  mechanics: Mechanic[] = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' },
    { id: '4', name: 'Sarah Williams' },
  ];

  serviceAssignments: Map<string, string[]> = new Map();
  activeDropdownServiceId: string | null = null;
  searchQuery: string = '';
  showDropdown: boolean = false;

  constructor() {}

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
    return this.mechanics.find(m => m.id === mechanicId)?.name || '';
  }

  getAssignedMechanics(serviceId: string): string[] {
    return this.serviceAssignments.get(serviceId) || [];
  }

  getFilteredMechanics(): Mechanic[] {
    return this.mechanics.filter(mechanic =>
      mechanic.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSave() {
    // TODO: Implement save logic
    console.log('Assignments saved:', Object.fromEntries(this.serviceAssignments));
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  protected readonly X = X;
  protected readonly User = User;
  protected readonly Search = Search;
}
