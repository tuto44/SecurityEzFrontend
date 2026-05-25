import { Component, Input } from '@angular/core';
import { Categoria } from '../../models/categoria';

@Component({
  selector: 'app-cu-categoria',
  standalone: false,
  templateUrl: './cu-categoria.component.html',
  styleUrl: './cu-categoria.component.css'
})
export class CuCategoriaComponent {
 
  @Input() categoria: Categoria | undefined;

}
