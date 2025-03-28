import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environments'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TaskHistoryService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAll(startDate: Date, endDate: Date): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks/histories`, {
      startDate,
      endDate
    });
  }

}
