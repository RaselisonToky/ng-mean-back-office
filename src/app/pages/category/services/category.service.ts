import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environments';
import {Category} from '../model/category.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }
  private baseUrl = environment.apiUrl;

  findAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category`);
  }
}
