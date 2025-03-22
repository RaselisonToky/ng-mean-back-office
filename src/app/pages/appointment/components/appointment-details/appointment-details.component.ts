import { Component } from '@angular/core';
import {Appointment, STATUS} from '../../model/appointment.model';
import {Brand} from '../../../brand/model/brand.model';
import {Model} from '../../../model/model/model.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AppointmentService} from '../../services/appointment.service';
import {BrandService} from '../../../brand/services/brand.service';
import {ModelService} from '../../../model/services/model.service';
import {
  AppointmentSummaryStepComponent
} from '../appointment-form/components/appointment-summary-step/appointment-summary-step.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-appointment-details',
  imports: [
    AppointmentSummaryStepComponent,
    CommonModule
  ],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.css'
})
export class AppointmentDetailsComponent {
  appointment: Appointment | null = null;
  brands: Brand[] = [];
  models: Model[] = [];
  isRequested: boolean = false;
  isLoading: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private brandService: BrandService,
    private modelService: ModelService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAppointment(id);
    } else {
      this.router.navigate(['/appointment']).then();
    }

    this.loadBrandsAndModels();
  }

  loadAppointment(id: string): void {
    this.appointmentService.findById(id).subscribe({
      next: (data: { data: Appointment | null; }) => {
        this.appointment = data.data;
        console.log(data.data)
        this.isRequested = this.appointment?.status === STATUS.REQUESTED;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching appointment:', error);
        this.isLoading = false;
        // Handle the error (e.g., show an error message, redirect)
      }
    });
  }

  loadBrandsAndModels(): void {
    this.brandService.findAll().subscribe({
      next: (data) => {
        this.brands = data.data;
      },
      error: (error) => {
        console.error('Error fetching brands:', error);
      }
    });

    this.modelService.findAll().subscribe({
      next: (data) => {
        this.models = data.data;
      },
      error: (error) => {
        console.error('Error fetching models:', error);
      }
    });
  }

  get appointmentDetails() {
    if (!this.appointment) {
      return null;
    }

    return {
      user: {
        name: this.appointment.name,
        email: this.appointment.email,
        phone: this.appointment.phone
      },
      vehicle: {
        brandId: this.appointment.carModel.brand._id,
        modelId: this.appointment.carModel._id,
        licensePlate: this.appointment.licensePlate
      },
      schedule: {
        date: this.formatDateForSummary(this.appointment.scheduleAt),
        time: this.formatTimeForSummary(this.appointment.scheduleAt)
      },
      services: this.appointment.services.map(service => ({
        _id: service._id,
        name: service.name,
        price: service.price,
        estimateDuration: service.estimateDuration
      }))
    };
  }

  formatDateForSummary(date: Date): string {
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0];
  }

  formatTimeForSummary(date: Date): string {
    const dateObj = new Date(date);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onConfirmAppointment(): void {
    if (this.appointment) {
      this.updateAppointmentStatus(this.appointment._id!, STATUS.PENDING);
    }
  }

  onRejectAppointment(): void {
    if (this.appointment) {
      // this.updateAppointmentStatus(this.appointment._id, STATUS.REJECTED);
    }
  }

  updateAppointmentStatus(id: string, status: STATUS): void {
    const appointment = this.appointment!;
    appointment.status = status;
    this.appointmentService.update(id, appointment).subscribe({
      next: () => {
        this.loadAppointment(id);
      },
      error: (error: any) => {
        console.error('Error updating appointment status:', error);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/appointment']).then();
  }
}
