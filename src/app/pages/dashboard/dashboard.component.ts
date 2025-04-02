import { Component, inject, OnInit, signal } from '@angular/core'
import { DashboardService } from './services/dashboard.service';
import AppointmentStatisticPerStatus from './model/dashboard.model';
import { UtilsService } from '../../shared/utils/utils.service';
import { AppointmentService } from '../appointment/services/appointment.service';
import { CalendarComponent } from '../../shared/ui/calendar/calendar.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CalendarComponent],
  standalone: true
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly appointmentService = inject(AppointmentService);
  protected readonly utils = inject(UtilsService);

  appointmentCountPerStatus: AppointmentStatisticPerStatus[] = [];
  appointmentCounts: { date: string; appointmentCount: number }[] = [];
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  statisticsStartDate: Date = new Date();
  statisticsEndDate: Date = new Date();

  constructor() {
    this.statisticsStartDate.setDate(1);
    this.statisticsStartDate.setHours(0, 0, 0, 0);
    this.statisticsEndDate.setMonth(this.statisticsEndDate.getMonth() + 1);
    this.statisticsEndDate.setDate(0);
    this.statisticsEndDate.setHours(23, 59, 59, 999);
  }

  ngOnInit() {
    this.loadAppointmentCountPerStatus();
    this.loadAppointmentsForMonth();
    this.loadGroupedServiceByCategory();
  }

  loadGroupedServiceByCategory(){
    const startDate = this.statisticsStartDate.toISOString().split('T')[0];
    const endDate = this.statisticsEndDate.toISOString().split('T')[0];
    this.dashboardService.getGroupedServiceByCategory(startDate, endDate).subscribe({
      next: (data) => {
        console.log(data.data);
      }
    })
  }

  loadAppointmentsForMonth() {
    const startDate = new Date(this.currentYear(), this.currentMonth(), 1);
    const endDate = new Date(this.currentYear(), this.currentMonth() + 1, 0);
    this.appointmentService.getAppointmentCountBetweenTwoDates(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ).subscribe({
      next: (data) => {
        this.appointmentCounts = data.data;
      }
    });
  }

  loadAppointmentCountPerStatus() {
    this.dashboardService.getAppointmentCountPerStatus().subscribe({
      next: (data) => {
        this.appointmentCountPerStatus = data.data;
      }
    });
  }

  handleMonthChange(event: { month: number; year: number }) {
    this.currentMonth.set(event.month);
    this.currentYear.set(event.year);
    this.loadAppointmentsForMonth();
  }
}
