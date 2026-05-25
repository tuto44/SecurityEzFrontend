import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoria';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  apiBase='';

  constructor(private _http: HttpClient) { 
    this.apiBase=environment.urlApiBase + 'categoria';
  }

  getCategorias(): Observable<Categoria[]> {
    return this._http.get<Categoria[]>(this.apiBase + '/');
  }

  crearCategoria(categoria: Categoria): Observable<void> {
    return this._http.post<void>(`${this.apiBase}/add`, categoria);
  }

  editarCategoria(id:number,categoria: Categoria): Observable<void> {
    return this._http.put<void>(`${this.apiBase}/${id}`, categoria);
  }

  eliminarCategoria(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiBase}/${id}`);
  }
}
