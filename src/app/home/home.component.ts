import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../models/categoria';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
vectorCategorias: Categoria[] = [];
  isLoading = true;

  constructor(private _categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.LoadCategorias();
  }

  LoadCategorias() {
    this.isLoading = true;
    this._categoriaService.getCategorias().subscribe({
      next: (rs) => {
        this.vectorCategorias = rs;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

}
