import { Component, Input, } from '@angular/core';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-cu-usuario',
  standalone: false,
  templateUrl: './cu-usuario.component.html',
  styleUrl: './cu-usuario.component.css'
})
export class CuUsuarioComponent {

  @Input() usuario: Usuario | undefined;
}
