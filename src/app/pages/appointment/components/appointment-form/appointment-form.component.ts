import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { StepperProgressComponent } from './components/stepper-progress/stepper-progress.component';
import { UserVehicleStepComponent } from './components/user-vehicle-step/user-vehicle-step.component';
import { ServiceSelectionStepComponent } from './components/service-selection-step/service-selection-step.component';
import { AppointmentSummaryStepComponent } from './components/appointment-summary-step/appointment-summary-step.component';
import { Service, UserVehicleFormData } from './mockData';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    StepperProgressComponent,
    UserVehicleStepComponent,
    ServiceSelectionStepComponent,
    AppointmentSummaryStepComponent,
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css',
})
export class AppointmentFormComponent {
  currentStep = 1;
  totalSteps = 3;
  formData: UserVehicleFormData | null = null;
  selectedServices: Service[] = [];

  schedule = {
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM'
  };

  get appointmentDetails() {
    if (!this.formData) return null;

    return {
      user: {
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone
      },
      vehicle: {
        brandId: this.formData.brandId,
        modelId: this.formData.modelId,
        licensePlate: this.formData.licensePlate
      },
      schedule: this.schedule,
      services: this.selectedServices
    };
  }

  handleNext(data: UserVehicleFormData) {
    console.log('Form data:', data);
    this.formData = data;
    this.currentStep = 2;
  }

  handlePrevious() {
    this.currentStep--;
  }

  handleServicesNext(services: Service[]) {
    console.log('Selected services:', services);
    this.selectedServices = services;
    this.currentStep = 3;
  }

  handleConfirm() {
    console.log('Appointment confirmed!');
  }
}
