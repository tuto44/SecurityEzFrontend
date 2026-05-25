import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  apiBase='';

  constructor(private _http: HttpClient) { 
    this.apiBase=environment.urlApiBase + 'producto';
  }

  getProductos(): Observable<Producto[]> {
    return this._http.get<Producto[]>(this.apiBase + '/');
  }

  crearProducto(producto: Producto): Observable<void> {
    return this._http.post<void>(`${this.apiBase}/add`, producto);
  }

  editarProducto(id:number,producto: Producto): Observable<void> {
    return this._http.put<void>(`${this.apiBase}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiBase}/${id}`);
  }
}
