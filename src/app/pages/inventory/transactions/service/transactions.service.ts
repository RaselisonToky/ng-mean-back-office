import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/inventory/transactions`)
  }
}
