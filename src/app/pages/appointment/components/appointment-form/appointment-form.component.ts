import { Component,OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StepperProgressComponent } from './components/stepper-progress/stepper-progress.component';
import { UserVehicleStepComponent } from './components/user-vehicle-step/user-vehicle-step.component';
import { ServiceSelectionStepComponent } from './components/service-selection-step/service-selection-step.component';
import { AppointmentSummaryStepComponent } from './components/appointment-summary-step/appointment-summary-step.component';
import { UserVehicleFormData } from './mockData';
import {BrandService} from '../../../brand/services/brand.service';
import {ModelService} from '../../../model/services/model.service';
import {Brand} from '../../../brand/model/brand.model';
import {Model} from '../../../model/model/model.model';
import {Service} from '../../../service/model/service.model';

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
export class AppointmentFormComponent implements OnInit {
  constructor(
    private brandService: BrandService,
    private modelService: ModelService,
  ) {}

  brands: Brand[] = [];
  models: Model[] = [];
  currentStep = 1;
  totalSteps = 3;
  formData: UserVehicleFormData | null = null;
  selectedServices: Service[] = [];

  ngOnInit() {
    this.fetchBrands();
    this.fetchModels();
  }

  fetchBrands(){
    this.brandService.findAll().subscribe({
      next: (data) => {
        this.brands = data.data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    });
  }

  fetchModels(){
    this.modelService.findAll().subscribe({
      next: (data) => {
        this.models = data.data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    })
  }

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
      schedule: {
        date: this.formData.appointmentDate,
        time: this.formData.appointmentTime,
      },
      services: this.selectedServices.map(service => ({
        _id: service._id,
        name: service.name,
        price: service.price,
        estimateDuration: service.estimateDuration
      }))
    };
  }

  handleNext(data: UserVehicleFormData) {
    this.formData = data;
    this.currentStep = 2;
  }

  handlePrevious() {
    this.currentStep--;
  }

  handleServicesNext(services: Service[]) {
    this.selectedServices = services;
    this.currentStep = 3;
  }

  handleConfirm() {
    console.log('Appointment confirmed!');
  }
}
