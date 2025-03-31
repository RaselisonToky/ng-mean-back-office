import { Component, inject, OnInit } from '@angular/core'
import { DashboardService } from './services/dashboard.service'
import AppointmentStatisticPerStatus from './model/dashboard.model'
import { UtilsService } from '../../shared/utils/utils.service'

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  protected readonly utils = inject(UtilsService);
  appointmentCountPerStatus: AppointmentStatisticPerStatus[] = [];


  ngOnInit() {
    this.dashboardService.getAppointmentCountPerStatus().subscribe({
      next: (data) =>{
        this.appointmentCountPerStatus = data.data;
      }
    })
  }

}
