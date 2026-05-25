import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBase = '';
  private jwtHelper = new JwtHelperService();

  // Observable para que el Navbar sepa en tiempo real si hay alguien logueado
  private _usuarioActual = new BehaviorSubject<any>(null);
  usuarioActual$ = this._usuarioActual.asObservable();

  constructor(private _http: HttpClient) {
    this.apiBase = environment.urlApiBase + 'usuario'; // Asegúrate de que coincida con tu ruta en express
    this.VerificarSesion();
  }

  // 1. INICIAR SESIÓN
  Login(usuario: string, contrasena: string): Observable<any> {
    return this._http.post<any>(`${this.apiBase}/login`, { Usuario: usuario, Contrasena: contrasena }).pipe(
      tap(res => {
        // Guardamos el token en el localStorage
        localStorage.setItem('securityEZ_token', res.token);
        // Decodificamos el payload para extraer los datos del usuario (Id, Nombre, TipoUsuario)
        const datosUsuario = this.jwtHelper.decodeToken(res.token);
        this._usuarioActual.next(datosUsuario);
      })
    );
  }

  // 2. REGISTRO PÚBLICO DE CLIENTES
  Registro(datosUsuario: any): Observable<any> {
    return this._http.post<any>(`${this.apiBase}/register`, datosUsuario);
  }

  // 3. CERRAR SESIÓN
  Logout() {
    localStorage.removeItem('securityEZ_token');
    this._usuarioActual.next(null);
  }

  // 4. VERIFICAR SI EL TOKEN SIGUE VIGENTE AL RECARGAR LA PÁGINA
  VerificarSesion() {
    const token = localStorage.getItem('securityEZ_token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const datosUsuario = this.jwtHelper.decodeToken(token);
      this._usuarioActual.next(datosUsuario);
    } else {
      this.Logout();
    }
  }

  // 5. GETTERS PARA FACILITAR VALIDACIONES EN BOTONES Y VISTAS
  get estaLogueado(): boolean {
    return this._usuarioActual.value !== null;
  }

  get esAdmin(): boolean {
    return this._usuarioActual.value?.TipoUsuario === 'Administrador';
  }

  get esCliente(): boolean {
    return this._usuarioActual.value?.TipoUsuario === 'Cliente';
  }

  get obtenerIdUsuario(): number {
    return this._usuarioActual.value?.IdUsuario || 1; // Cae en 1 por defecto por seguridad si falla
  }
}