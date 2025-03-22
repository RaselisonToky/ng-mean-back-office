import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Brand} from '../../../../../brand/model/brand.model';
import {Model} from '../../../../../model/model/model.model';
import {UserVehicleFormData} from '../../mockData';
import {AppointmentService} from '../../../../services/appointment.service';
import {TimeChipPickerComponent} from './time-chip-picker/time-chip-picker.component';

@Component({
  selector: 'app-user-vehicle-step',
  imports: [CommonModule, FormsModule, TimeChipPickerComponent],
  templateUrl: './user-vehicle-step.component.html',
  styleUrl: './user-vehicle-step.component.css'
})
export class UserVehicleStepComponent implements OnInit {
  constructor(
    private appointmentService: AppointmentService,
  ) {}

  @Output() onNext = new EventEmitter<UserVehicleFormData>();
  name: string = 'Toky';
  email: string = 'toky@gmail.com';
  phone: string = '0343061615';
  selectedBrandId: string = '';
  selectedModelId: string = '';
  licensePlate: string = '789';
  appointmentDate: string = '';
  appointmentTime: string = '';
  availableTimeSlots : string[] = [];

  formErrors: Record<string, string> = {};
  @Input() brands: Brand[] = [];
  @Input() models: Model[] = [];
  filteredModels: Model[] = [];

  ngOnInit(): void {
    this.appointmentDate = new Date().toISOString().split('T')[0];
    this.fetchAvailableTimeSlots(new Date());
  }

  onBrandChange(brandId: string) {
    this.selectedBrandId = brandId;
    this.selectedModelId = '';
    this.filteredModels = this.models.filter(model => model.brand._id === brandId);
  }

  onScheduleAppointmentDateChange(date: string) {
    const newDate = new Date(date);
    this.fetchAvailableTimeSlots(newDate);
  }

  onTimeChange(time: string): void {
    this.appointmentTime = time;
  }

  fetchAvailableTimeSlots(filterDate: Date) {
    this.appointmentService.getAvailableSlots(filterDate).subscribe({
      next: (response: any) => {
        this.availableTimeSlots = response.data;
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des créneaux disponibles :", error);
      }
    });
  }

  validateForm(): boolean {
    this.formErrors = {};
    if (!this.name) this.formErrors['name'] = 'Name is required';
    if (!this.email) this.formErrors['email'] = 'Email is required';
    if (!this.phone) this.formErrors['phone'] = 'Phone number is required';
    if (!this.selectedBrandId) this.formErrors['brandId'] = 'Brand is required';
    if (!this.selectedModelId) this.formErrors['modelId'] = 'Model is required';
    if (!this.licensePlate) this.formErrors['licensePlate'] = 'License plate is required';
    if (!this.appointmentDate) this.formErrors['appointmentDate'] = 'Date is required';
    if (!this.appointmentTime) this.formErrors['appointmentTime'] = 'Time is required';

    return Object.keys(this.formErrors).length === 0;
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.validateForm()) {
      const formData: UserVehicleFormData = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        brandId: this.selectedBrandId,
        modelId: this.selectedModelId,
        licensePlate: this.licensePlate,
        appointmentDate: this.appointmentDate,
        appointmentTime: this.appointmentTime,
      };
      this.onNext.emit(formData);
    }
  }
}
