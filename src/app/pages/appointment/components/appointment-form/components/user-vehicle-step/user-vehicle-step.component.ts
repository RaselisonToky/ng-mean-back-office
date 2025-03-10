import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Brand} from '../../../../../brand/model/brand.model';
import {Model} from '../../../../../model/model/model.model';
import {UserVehicleFormData} from '../../mockData';

@Component({
  selector: 'app-user-vehicle-step',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-vehicle-step.component.html',
  styleUrl: './user-vehicle-step.component.css'
})
export class UserVehicleStepComponent implements OnInit {
  @Output() onNext = new EventEmitter<UserVehicleFormData>();
  name: string = 'Toky';
  email: string = 'toky@gmail.com';
  phone: string = '0343061615';
  selectedBrandId: string = '';
  selectedModelId: string = '';
  licensePlate: string = '789';
  appointmentDate: string = '';
  appointmentTime: string = '10:00';

  formErrors: Record<string, string> = {};
  @Input() brands: Brand[] = [];
  @Input() models: Model[] = [];
  filteredModels: Model[] = [];
  minDate: string = '';

  ngOnInit(): void {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  onBrandChange(brandId: string) {
    this.selectedBrandId = brandId;
    this.selectedModelId = '';
    this.filteredModels = this.models.filter(model => model.brand._id === brandId);
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
