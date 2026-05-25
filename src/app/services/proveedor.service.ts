import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Proveedor } from '../models/proveedor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  apiBase='';

  constructor(private _http: HttpClient) { 
    this.apiBase=environment.urlApiBase + 'proveedor';
  }

  getProveedores(): Observable<Proveedor[]> {
    return this._http.get<Proveedor[]>(this.apiBase + '/');
  }
  
  crearProveedor(proveedor: Proveedor): Observable<void> {
    return this._http.post<void>(`${this.apiBase}/add`, proveedor);
  }

  editarProveedor(id:number,proveedor: Proveedor): Observable<void> {
    return this._http.put<void>(`${this.apiBase}/${id}`, proveedor);
  }

  eliminarProveedor(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiBase}/${id}`);
  }
}
