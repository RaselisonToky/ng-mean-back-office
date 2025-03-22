import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { Observable, catchError, map, shareReplay } from 'rxjs';
import { Task, TaskDto } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  upsertMany(tasksData: TaskDto[]): Observable<{data: Task[]}> {
    return this.http.post<{data: Task[]}>(`${this.baseUrl}/tasks`, tasksData)
      .pipe(
        map(response => response),
        shareReplay(1),
        catchError(error => {
          console.error('Erreur lors de l\'upsert des tâches:', error);
          throw error;
        })
      );
  }

  getTasksByAppointment(appointmentId: string): Observable<{data: TaskDto[]}> {
    return this.http.get<{data: TaskDto[]}>(`${this.baseUrl}/tasks/${appointmentId}`);
  }

  findTaskByUserId(userId: string): Observable<{data: Task[]}> {
    return this.http.get<{data: Task[]}>(`${this.baseUrl}/tasks/task/${userId}`);
  }

  findTaskByAppointmentIdAndServiceId(appointmentId: string, serviceId: string): Observable<{data: Task}> {
    const body = {
      appointmentId,
      serviceId
    }
    return this.http.post<{data: Task}>(`${this.baseUrl}/tasks/service`,body);
  }

  updateTask(id:string, task: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/tasks/update/${id}`, task);
  }
}
