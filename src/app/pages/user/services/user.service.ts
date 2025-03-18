import {environment} from '../../../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService{
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getUsersByRole(userId: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/users/role/${userId}`)
  }

  getUserById(userId: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/users/${userId}`)
  }
}
