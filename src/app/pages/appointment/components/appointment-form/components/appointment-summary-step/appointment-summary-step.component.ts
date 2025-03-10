import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { brands, models } from '../../mockData';

interface AppointmentDetails {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    brandId: string;
    modelId: string;
    licensePlate: string;
  };
  schedule: {
    date: string;
    time: string;
  };
  services: Array<{
    id: string;
    name: string;
    price: number;
    estimateDuration: number;
  }>;
}

@Component({
  selector: 'app-appointment-summary-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-summary-step.component.html',
  styleUrl: './appointment-summary-step.component.css',
})
export class AppointmentSummaryStepComponent {
  @Input() appointmentDetails!: AppointmentDetails;
  @Output() onPrevious = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  isSubmitting = false;
  isSuccess = false;

  get brand() {
    return brands.find(b => b.id === this.appointmentDetails.vehicle.brandId);
  }

  get model() {
    return models.find(m => m.id === this.appointmentDetails.vehicle.modelId);
  }

  get totalPrice() {
    return this.appointmentDetails.services.reduce(
      (sum, service) => sum + service.price,
      0
    );
  }

  get totalDuration() {
    return this.appointmentDetails.services.reduce(
      (sum, service) => sum + service.estimateDuration,
      0
    );
  }

  formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  handleConfirm() {
    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      console.group('Appointment Confirmation');
      console.log('User Information:', this.appointmentDetails.user);
      console.log('Vehicle Information:', {
        brand: this.brand?.name,
        model: this.model?.name,
        licensePlate: this.appointmentDetails.vehicle.licensePlate
      });
      console.log('Appointment Date:', this.formatDate(this.appointmentDetails.schedule.date));
      console.log('Appointment Time:', this.appointmentDetails.schedule.time);
      console.log('Selected Services:', this.appointmentDetails.services);
      console.log('Total Price:', `$${this.totalPrice.toFixed(2)}`);
      console.log('Estimated Duration:', `${this.totalDuration} minutes`);
      console.groupEnd();

      this.isSubmitting = false;
      this.isSuccess = true;
      this.onConfirm.emit();
    }, 1500);
  }

  reloadPage() {
    window.location.reload();
  }
}
