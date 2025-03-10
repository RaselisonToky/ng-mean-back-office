import { Component, OnInit } from '@angular/core';
import {AppointmentListComponent} from './components/appointment-list/appointment-list.component';

@Component({
  selector: 'app-appointment',
  imports: [AppointmentListComponent],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {

}
