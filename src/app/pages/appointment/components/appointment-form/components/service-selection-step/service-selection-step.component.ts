import { Component, EventEmitter, Output } from '@angular/core';
import { JsonPipe, NgClass, NgStyle } from '@angular/common';

interface Service {
  id: string;
  name: string;
  price: number;
  estimateDuration: number;
  categoryId: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  backgroundColor: string;
  color: string;
  borderColor: string;
}

@Component({
  selector: 'app-service-selection-step',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './service-selection-step.component.html',
  styleUrl: './service-selection-step.component.css',
})
export class ServiceSelectionStepComponent {
  @Output() onPrevious = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<Service[]>();

  selectedServiceIds: string[] = [];
  activeTab: string;

  serviceCategories: ServiceCategory[] = [
    {
      id: 'maintenance',
      name: 'Maintenance',
      backgroundColor: '#e6f7ff',
      color: '#0066cc',
      borderColor: '#99ccff'
    },
    {
      id: 'repair',
      name: 'Repair',
      backgroundColor: '#fff3e6',
      color: '#cc6600',
      borderColor: '#ffcc99'
    },
    {
      id: 'inspection',
      name: 'Inspection',
      backgroundColor: '#e6fff3',
      color: '#00cc66',
      borderColor: '#99ffcc'
    }
  ];

  services: Service[] = [
    { id: '1', name: 'Oil Change', price: 49.99, estimateDuration: 30, categoryId: 'maintenance' },
    { id: '2', name: 'Tire Rotation', price: 29.99, estimateDuration: 20, categoryId: 'maintenance' },
    { id: '3', name: 'Brake Pad Replacement', price: 149.99, estimateDuration: 60, categoryId: 'repair' },
    { id: '4', name: 'Battery Replacement', price: 119.99, estimateDuration: 45, categoryId: 'repair' },
    { id: '5', name: 'Full Inspection', price: 89.99, estimateDuration: 90, categoryId: 'inspection' },
    { id: '6', name: 'Emissions Test', price: 39.99, estimateDuration: 30, categoryId: 'inspection' }
  ];

  constructor() {
    this.activeTab = this.serviceCategories[0].id;
  }

  // Method to filter services by category
  getServicesByCategory(categoryId: string): Service[] {
    return this.services.filter(service => service.categoryId === categoryId);
  }

  toggleService(serviceId: string): void {
    const index = this.selectedServiceIds.indexOf(serviceId);

    if (index === -1) {
      this.selectedServiceIds.push(serviceId);
    } else {
      this.selectedServiceIds.splice(index, 1);
    }
  }

  handleNext(): void {
    if (this.selectedServiceIds.length === 0) return;

    const selectedServicesList = this.services.filter(service =>
      this.selectedServiceIds.includes(service.id)
    );

    this.onNext.emit(selectedServicesList);
  }

  isServiceSelected(serviceId: string): boolean {
    return this.selectedServiceIds.includes(serviceId);
  }

  get totalPrice(): number {
    return this.services
      .filter(service => this.selectedServiceIds.includes(service.id))
      .reduce((sum, service) => sum + service.price, 0);
  }

  get totalDuration(): number {
    return this.services
      .filter(service => this.selectedServiceIds.includes(service.id))
      .reduce((sum, service) => sum + service.estimateDuration, 0);
  }
}
