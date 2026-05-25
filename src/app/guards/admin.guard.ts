import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(): boolean {
    // 1. Verificamos si está logueado y si su TipoUsuario es 'Administrador'
    if (this._authService.estaLogueado && this._authService.esAdmin) {
      return true; // Acceso concedido
    }

    // 2. Si es un 'Cliente' o un intruso, lo rebotamos al Home con una advertencia
    Swal.fire({
      icon: 'error',
      title: 'Acceso Denegado',
      text: 'No tienes permisos de Administrador para acceder a este módulo.',
      confirmButtonColor: '#DD0303'
    });

    this._router.navigate(['/home']);
    return false;
  }
}