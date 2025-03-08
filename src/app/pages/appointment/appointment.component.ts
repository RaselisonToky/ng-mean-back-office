import { Component, OnInit } from '@angular/core';
import { AppointmentService } from './services/appointment.service';
import { Appointment, STATUS } from './model/appointment.model';
import { CustomTableComponent } from '../../shared/ui/custom-table/custom-table.component';
import { CommonModule, DatePipe } from '@angular/common';
import { STATUS_CHIP_COLORS, STATUS_LABELS_FR } from '../../shared/constants/constant';

@Component({
  selector: 'app-appointment',
  imports: [
    CustomTableComponent,
    DatePipe,
    CommonModule,
  ],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  tableHeaders = ['Client', 'e-mail', 'marque', 'model', 'services', 'programmé le', 'durée', 'prix', 'status'];
  statusChipColors = STATUS_CHIP_COLORS;
  statusLabelsFr = STATUS_LABELS_FR;

  expandedRows = new Set<number>();

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadAppointment();
  }

  loadAppointment(): void {
    this.appointmentService.findAll().subscribe({
      next: (data) => {
        this.appointments = data.data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    });
  }

  onRowClick(item: any): void {
    console.log('Ligne cliquée:', item);
  }

  toggleExpand(index: number): void {
    if (this.expandedRows.has(index)) {
      this.expandedRows.delete(index);
    } else {
      this.expandedRows.add(index);
    }
  }

  getStatusChipStyle(status: any): { backgroundColor: string; borderColor: string; color: string } {
    return this.statusChipColors[status as STATUS];
  }

  getStatusLabel(status: any): string {
    return this.statusLabelsFr[status as STATUS];
  }

  shouldShowExpansionChevron(services: any[]): boolean {
    // You may need to adjust this logic based on your design requirements
    return services.length > 2;
  }
}
