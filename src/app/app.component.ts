import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router) { }

isLoginRoute(): boolean {
    const urlActual = this.router.url;
    // Devuelve true si estás en login O si estás en registro
    return urlActual.includes('/login') || urlActual.includes('/registro');
  }

  title = 'Proyecto';
}
