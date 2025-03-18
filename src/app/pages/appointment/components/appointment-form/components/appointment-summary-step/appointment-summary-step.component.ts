import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Model} from '../../../../../model/model/model.model';
import {Brand} from '../../../../../brand/model/brand.model';
import {AppointmentService} from '../../../../services/appointment.service';
import {STATUS} from '../../../../model/appointment.model';

interface AppointmentDetails {
  user: { name: string; email: string; phone: string; };
  vehicle: { brandId: string; modelId: string; licensePlate: string; };
  schedule: { date: string; time: string; };
  services: {
    _id: string;
    name: string;
    price: number;
    estimateDuration: number;
  }[];
}


@Component({
  selector: 'app-appointment-summary-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-summary-step.component.html',
  styleUrl: './appointment-summary-step.component.css',
})
export class AppointmentSummaryStepComponent {
  constructor(
    private appointmentService: AppointmentService,
  ) {
  }

  @Input() appointmentDetails!: AppointmentDetails;
  @Input() brands: Brand[] = [];
  @Input() models: Model[] = [];
  @Output() onPrevious = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  isSubmitting = false;
  isSuccess = false;

  get brand() {
    return this.brands.find((b) => b._id === this.appointmentDetails.vehicle.brandId);
  }

  get model() {
    return this.models.find((m) => m._id === this.appointmentDetails.vehicle.modelId);
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
    const scheduleAt = new Date(`${this.appointmentDetails.schedule.date}T${this.appointmentDetails.schedule.time}:00`);
    const newAppointmentData = {
      name: this.appointmentDetails.user.name,
      email: this.appointmentDetails.user.email,
      phone: this.appointmentDetails.user.phone,
      carModel: this.appointmentDetails.vehicle.modelId,
      licensePlate: this.appointmentDetails.vehicle.licensePlate,
      services: this.appointmentDetails.services.map(service => service._id),
      scheduleAt,
      estimateDuration: this.totalDuration,
      estimatedPrice: this.totalPrice,
      status: STATUS.PENDING
    }

    this.appointmentService.create(newAppointmentData).subscribe({
      next: (response) => {
        this.isSuccess = true;
        this.onConfirm.emit();
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  reloadPage() {
    window.location.reload();
  }
}
