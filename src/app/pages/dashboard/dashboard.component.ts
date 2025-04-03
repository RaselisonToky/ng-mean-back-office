import { Component, inject, OnInit, signal } from '@angular/core'
import { DashboardService } from './services/dashboard.service';
import AppointmentStatisticPerStatus, {
  ChartData,
  ServiceCountByCategories,
} from './model/dashboard.model'
import { UtilsService } from '../../shared/utils/utils.service';
import { AppointmentService } from '../appointment/services/appointment.service';
import { CalendarComponent } from '../../shared/ui/calendar/calendar.component'
import { DonutChartComponent } from '../../shared/ui/donut-chart/donut-chart.component'
import { LineChartComponent } from '../../shared/ui/line-chart/line-chart.component'
import { PlaceHolderLoadingComponent } from '../../shared/ui/place-holder-loading/place-holder-loading.component'
import { FooterComponent } from '../../shared/ui/footer/footer.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CalendarComponent, DonutChartComponent, LineChartComponent, PlaceHolderLoadingComponent, FooterComponent],
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
  pieStatisticsStartDate: Date = new Date();
  pieStatisticsEndDate: Date = new Date();
  serviceCountByCategories: ServiceCountByCategories[] = [];
  servicePercentageByCategories: ChartData[] = [];
  dailyRevenueStartDate: Date = new Date();
  dailyRevenueEndDate: Date = new Date();
  dailyRevenue: ChartData[] = [];
  formattedDailyRevenue: ChartData[] = [];

  loading = signal(true);
  loadingAppointmentStats = signal(true);
  loadingCalendar = signal(true);
  loadingPieChart = signal(true);
  loadingLineChart = signal(true);

  constructor() {
    this.pieStatisticsStartDate.setDate(1);
    this.pieStatisticsEndDate.setMonth(this.pieStatisticsEndDate.getMonth() + 1);
    this.pieStatisticsStartDate.setHours(0, 0, 0, 0);
    this.pieStatisticsEndDate.setDate(0);
    this.pieStatisticsEndDate.setHours(23, 59, 59, 999);
    this.dailyRevenueEndDate = new Date();
    this.dailyRevenueStartDate = new Date();
    this.dailyRevenueStartDate.setDate(this.dailyRevenueStartDate.getDate() - 20);
  }

  ngOnInit() {
      this.loading.set(false);
      this.loadAppointmentCountPerStatus();
      this.loadAppointmentsForMonth();
      this.loadGroupedServiceByCategory();
      this.loadDailyRevenue();
  }

  loadGroupedServiceByCategory(){
    const startDate = this.pieStatisticsStartDate.toISOString().split('T')[0];
    const endDate = this.pieStatisticsEndDate.toISOString().split('T')[0];
    this.dashboardService.getGroupedServiceByCategory(startDate, endDate).subscribe({
      next: (data) => {
        this.serviceCountByCategories = data.data;
        this.servicePercentageByCategories = this.getPercentageByCategory();
        this.loadingPieChart.set(false);
      }
    })
  }

  loadDailyRevenue(){
    const startDate = this.dailyRevenueStartDate.toISOString().split('T')[0];
    const endDate = this.dailyRevenueEndDate.toISOString().split('T')[0];
    this.dashboardService.loadDailyRevenue(startDate, endDate).subscribe({
      next: (data) => {
        this.dailyRevenue = data.data;
        this.formattedDailyRevenue = this.getFormattedDailyRevenue();
        this.loadingLineChart.set(false);
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
        this.loadingCalendar.set(false);
      }
    });
  }

  loadAppointmentCountPerStatus() {
    this.dashboardService.getAppointmentCountPerStatus().subscribe({
      next: (data) => {
        this.appointmentCountPerStatus = data.data;
        this.loadingAppointmentStats.set(false);
      }
    });
  }

  getPercentageByCategory(): ChartData[] {
    let totalServiceCount = 0;
    for (let i = 0; i < this.serviceCountByCategories.length ; i++) {
      totalServiceCount += this.serviceCountByCategories[i].count;
    }
    let results: ChartData[] = [];
    for (let i = 0; i < this.serviceCountByCategories.length ; i++) {
      const percentage = ( this.serviceCountByCategories[i].count * 100 ) / totalServiceCount;
      results.push({
        key: this.serviceCountByCategories[i].name,
        value: percentage,
      })
    }
    return results;
  }

  getFormattedDailyRevenue(): ChartData[] {
    const formattedData: ChartData[] = [];
    for (const item of this.dailyRevenue) {
      const dateParts = item.key.split('-');
      const day = dateParts[2];
      formattedData.push({
        key: day,
        value: item.value
      });
    }

    return formattedData;
  }

  handleMonthChange(event: { month: number; year: number }) {
    this.currentMonth.set(event.month);
    this.currentYear.set(event.year);
    this.loadingCalendar.set(true);
    this.loadAppointmentsForMonth();
  }
}
