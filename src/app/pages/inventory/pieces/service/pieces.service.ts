import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments';
import { Observable } from 'rxjs';
import { Piece } from '../model/piece.model';

@Injectable({
  providedIn: 'root',
})
export class PiecesService {
  private baseUrl = environment.apiUrl + '/inventory/pieces';

  constructor(private http: HttpClient) { }


  findAll(): Observable<{ data: Piece[] }> {
    return this.http.get<{ data: Piece[] }>(this.baseUrl);
  }


  findById(id: number): Observable<Piece> {
    return this.http.get<Piece>(`${this.baseUrl}/${id}`);
  }


  create(piece: Piece): Observable<Piece> {
    return this.http.post<Piece>(this.baseUrl, piece);
  }


  update(id: string, piece: Piece): Observable<Piece> {
    return this.http.put<Piece>(`${this.baseUrl}/${id}`, piece);
  }


  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
