import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environments';
import {Observable} from 'rxjs';
import {Task, TaskDto} from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(
    private http: HttpClient,
  ) {}

  private baseUrl = environment.apiUrl;

  upsertMany(tasksData: TaskDto[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks`, tasksData);
  }

  getTasksByAppointment(appointmentId: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/tasks/${appointmentId}`);
  }
}
