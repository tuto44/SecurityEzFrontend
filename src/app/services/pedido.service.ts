import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  apiBase='';

  constructor(private _http: HttpClient) { 
    this.apiBase=environment.urlApiBase + 'pedido';
  }

  getPedidos(): Observable<Pedido[]> {
    return this._http.get<Pedido[]>(this.apiBase + '/');
  }

  crearPedido(pedido: Pedido): Observable<void> {
    return this._http.post<void>(`${this.apiBase}/add`, pedido);
  }

  editarPedido(id:number,pedido: Pedido): Observable<void> {
    return this._http.put<void>(`${this.apiBase}/${id}`, pedido);
  }

  eliminarPedido(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiBase}/${id}`);
  }

  registrarPedidoCompleto(pedidoDTO: any): Observable<any> {
    // Apunta a la ruta transaccional que crearemos en Node.js
    return this._http.post<any>(`${this.apiBase}/registrar-todo`, pedidoDTO);
  }
}
