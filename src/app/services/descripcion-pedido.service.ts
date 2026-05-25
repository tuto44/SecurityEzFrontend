import { Injectable } from '@angular/core';
import { DescripcionPedido } from '../models/descripcionPedido';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DescripcionPedidoService {
  apiBase='';

  constructor(private _http: HttpClient) { 
    this.apiBase=environment.urlApiBase + 'descripcionpedido';
  }

  getDescripcionPedidos(): Observable<DescripcionPedido[]> {
    return this._http.get<DescripcionPedido[]>(this.apiBase + '/');
  }

  crearDescripcionPedido(descripcionPedido: DescripcionPedido): Observable<void> {
    return this._http.post<void>(`${this.apiBase}/add`, descripcionPedido);
  }

  editarDescripcionPedido(id:number,descripcionPedido: DescripcionPedido): Observable<void> {
    return this._http.put<void>(`${this.apiBase}/${id}`, descripcionPedido);
  }

  eliminarDescripcionPedido(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiBase}/${id}`);
  }


}
