import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private baseUrl = environment.apiUrl + '/inventory/delivery';

  constructor(private http: HttpClient) { }

  findAll(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  search(query: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search`, { params: { query } });
  }
}
