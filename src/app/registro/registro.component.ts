import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  // Objeto enlazado al formulario basado en tu interfaz de TypeScript
  nuevoUsuario = {
    Nombre: '',
    Direccion: '',
    Telefono: null,
    Usuario: '',
    Contrasena: ''
  };

  confirmarContrasena: string = '';
  isLoading: boolean = false;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  registrar() {
    // 1. Validación de contraseñas idénticas en el cliente
    if (this.nuevoUsuario.Contrasena !== this.confirmarContrasena) {
      Swal.fire({
        icon: 'error',
        title: 'Las contraseñas no coinciden',
        text: 'Por favor, verifique que ambas contraseñas sean iguales.',
        confirmButtonColor: '#DD0303'
      });
      return;
    }

    this.isLoading = true;

    // 2. Consumir el endpoint de autoregistro público
    this._authService.Registro(this.nuevoUsuario).subscribe({
      next: (res) => {
        this.isLoading = false;
        
        Swal.fire({
          icon: 'success',
          title: '¡Registro Exitoso!',
          text: 'Tu cuenta ha sido creada. Ya puedes iniciar sesión.',
          confirmButtonColor: '#FAB12F'
        });

        // Lo mandamos al login para que estrene sus credenciales
        this._router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        
        Swal.fire({
          icon: 'error',
          title: 'No se pudo crear la cuenta',
          text: err.error?.message || 'Hubo un problema en el servidor.',
          confirmButtonColor: '#DD0303'
        });
      }
    });
  }
}