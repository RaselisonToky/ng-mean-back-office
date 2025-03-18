 import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { Role } from '../../user/model/user.model';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

interface JwtPayload {
  sub: string;
  roles: Role[];
  iat: number;
  exp: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private readonly isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`, loginData);
  }

  register(registerData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/register`, registerData);
  }

  setAuth(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
      try {
        const decodedToken: JwtPayload = jwtDecode(token);
        const roles = decodedToken.roles.map(name => name);

        localStorage.setItem('roles', JSON.stringify(roles));
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
      }
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: JwtPayload = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      if (token) {
        if (this.isTokenExpired(token)) {
          this.logout();
          return null;
        }
        return token;
      }
    }
    return null;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
      window.location.reload();
    }
  }

  getRoles(): string[] | null {
    if (this.isBrowser) {
      const rolesString = localStorage.getItem('roles');
      return rolesString ? JSON.parse(rolesString) : null;
    }
    return null;
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode(token);
        return decodedToken['userId'];
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

}
