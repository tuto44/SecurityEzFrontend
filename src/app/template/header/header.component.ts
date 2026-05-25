import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // <-- Importamos tu nuevo servicio

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  // Guardaremos los datos que vienen dentro del JWT (Nombre, TipoUsuario, etc.)
  currentUsuario: any = null; 

  constructor(
    public _authService: AuthService, // <-- Inyectamos el servicio del JWT
    private _router: Router
  ) { }

  ngOnInit(): void {
    // Escuchamos activamente el estado de la sesión
    this._authService.usuarioActual$.subscribe({
      next: (usuario) => {
        this.currentUsuario = usuario;

        // NOTA: Quitamos la redirección forzada automática al login desde aquí.
        // Deja que el usuario navegue libremente por el Home o Catálogo público.
        // Más adelante protegeremos las rutas de administración usando Guards reales.
      }
    });
  }

  // Método para el botón de "Cerrar Sesión" en tu Navbar HTML
  logout() {
    this._authService.Logout();
    this._router.navigate(['/login']);
  }
}