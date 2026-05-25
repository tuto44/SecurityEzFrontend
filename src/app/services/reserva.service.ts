import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  apiBase='';

  constructor(private _http: HttpClient) { 
    this.apiBase=environment.urlApiBase + 'reserva';
  }

  getReservas(): Observable<Reserva[]> {
    return this._http.get<Reserva[]>(this.apiBase + '/');
  }

  crearReserva(reserva: Reserva): Observable<void> {
      return this._http.post<void>(`${this.apiBase}/add`, reserva);
    }
  
  editarReserva(id:number,reserva: Reserva): Observable<void> {
      return this._http.put<void>(`${this.apiBase}/${id}`, reserva);
    }
  
  eliminarReserva(id: number): Observable<void> {
      return this._http.delete<void>(`${this.apiBase}/${id}`);
    }
}
