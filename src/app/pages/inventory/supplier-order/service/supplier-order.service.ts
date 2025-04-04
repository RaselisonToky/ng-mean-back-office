import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SupplierOrderService {
  private baseUrl = environment.apiUrl + '/inventory/supplierOrder';
  constructor(private http: HttpClient) { }
  findAll() {
    return this.http.get(`${this.baseUrl}`);
  }

  search(query: any) {
    // delete undefined properties from query
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === '') {
        delete query[key];
      }
    });
    // Convert date strings to ISO format if they are not empty
    return this.http.get(`${this.baseUrl}/search`, { params: query });
  }
}
