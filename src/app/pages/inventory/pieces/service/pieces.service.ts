import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments';
import { Observable } from 'rxjs';
import { Piece } from '../model/piece.model';

@Injectable({
  providedIn: 'root',
})
export class PiecesService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  findAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/inventory/pieces`);
  }
}
