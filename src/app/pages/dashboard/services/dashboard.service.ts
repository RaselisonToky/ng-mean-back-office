import { Injectable } from '@angular/core'
import { environment } from '../../../../environments/environments'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAppointmentCountPerStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/count-per-status`);
  }
}
