import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environments';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;

  findAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/model`);
  }
}
