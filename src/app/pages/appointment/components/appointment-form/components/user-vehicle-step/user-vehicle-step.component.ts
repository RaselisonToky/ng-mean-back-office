import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importez FormsModule
import { Brand, Model, brands, models } from '../../mockData';

interface UserVehicleFormData {
  name: string;
  email: string;
  phone: string;
  brandId: string;
  modelId: string;
  licensePlate: string;
  appointmentDate: string;
  appointmentTime: string;
}

@Component({
  selector: 'app-user-vehicle-step',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-vehicle-step.component.html',
  styleUrl: './user-vehicle-step.component.css'
})
export class UserVehicleStepComponent implements OnInit {
  @Output() onNext = new EventEmitter<UserVehicleFormData>();

  name: string = '';
  email: string = '';
  phone: string = '';
  selectedBrandId: string = '';
  selectedModelId: string = '';
  licensePlate: string = '';
  appointmentDate: string = '';
  appointmentTime: string = '';
  formErrors: Record<string, string> = {};
  brands: Brand[] = brands;
  models: Model[] = models;
  filteredModels: Model[] = [];
  minDate: string = '';

  ngOnInit(): void {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  onBrandChange(brandId: string) {
    this.selectedBrandId = brandId;
    this.selectedModelId = ''; // Reset model selection
    this.filteredModels = this.models.filter(model => model.brandId === brandId);
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
        appointmentTime: this.appointmentTime
      };
      this.onNext.emit(formData);
    }
  }
}
