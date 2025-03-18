import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import {Appointment, AppointmentDto} from '../model/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(startDate: Date, endDate: Date): Observable<any> {
    const body = {
      startDate,
      endDate,
    }
    return this.http.post(`${this.baseUrl}/appointment/monitoring`,body);
  }

  create(appointment: AppointmentDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointment`, appointment);
  }

  getAvailableSlots(filter_date: Date): Observable<any>{
    return this.http.get(`${this.baseUrl}/appointment/available-time-slots/${filter_date}`);
  }

}
