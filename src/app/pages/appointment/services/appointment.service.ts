import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import {Appointment, AppointmentDto} from '../model/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  findAll(startDate: Date, endDate: Date): Observable<any> {
    const body = {

      startDate,
      endDate,
    }
    return this.http.post(`${this.baseUrl}/appointment/monitoring`,body);
  }

  findById(id: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/appointment/${id}`);
  }

  update(appointmentId: string, appointmentDto: Appointment): Observable<any> {
    return this.http.put(`${this.baseUrl}/appointment/${appointmentId}`, appointmentDto);
  }

  create(appointment: AppointmentDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointment`, appointment);
  }

  getAvailableSlots(filter_date: Date): Observable<any>{
    return this.http.get(`${this.baseUrl}/appointment/available-time-slots/${filter_date}`);
  }

  getAppointmentCountBetweenTwoDates(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/between-dates`,{
      params: {
        startDate,
        endDate
      }
    });
  }

}
