import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; // <-- Importamos tu nuevo servicio
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  usr: string = '';
  pwd: string = '';
  isLoading: boolean = false;

  constructor(
    private _authService: AuthService, // <-- Inyección del servicio real
    private _router: Router
  ) { }

  login() {
    if (!this.usr.trim() || !this.pwd.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, digite su usuario y contraseña.',
        confirmButtonColor: '#FAB12F'
      });
      return;
    }

    this.isLoading = true;

    this._authService.Login(this.usr, this.pwd).subscribe({
      next: (res) => {
        this.isLoading = false;
        
        // Toast elegante de bienvenida en la esquina superior derecha
        Swal.fire({
          text: `¡Bienvenido de nuevo, ${res.user.Nombre}!`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        });

        // Redirección automática
        this._router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: err.error?.message || 'Usuario o contraseña incorrectos.',
          confirmButtonColor: '#DD0303'
        });
      }
    });
  }
}