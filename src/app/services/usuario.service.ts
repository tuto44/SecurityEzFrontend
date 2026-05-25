import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  apiBase='';

  constructor(private _http: HttpClient) { 
    this.apiBase=environment.urlApiBase + 'usuario';
  }

  getUsuarios(): Observable<Usuario[]> {
    return this._http.get<Usuario[]>(this.apiBase + '/');
  }

  crearUsuario(usuario: Usuario): Observable<void> {
    return this._http.post<void>(`${this.apiBase}/add`, usuario);
  }

  editarUsuario(id:number,usuario: Usuario): Observable<void> {
    return this._http.put<void>(`${this.apiBase}/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiBase}/${id}`);
  }
}