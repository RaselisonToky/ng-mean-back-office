import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SupplierOrderService {
  private baseUrl = environment.apiUrl + '/inventory/supplier/order';
  constructor(private http: HttpClient) { }
  findAll() {
    return this.http.get(`${this.baseUrl}`);
  }

  search(query: any) {
    return this.http.get(`${this.baseUrl}/search`, { params: query });
  }
}
