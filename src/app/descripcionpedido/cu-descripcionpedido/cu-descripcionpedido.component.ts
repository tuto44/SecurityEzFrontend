import { Component, Input } from '@angular/core';
import { DescripcionPedido } from '../../models/descripcionPedido';

@Component({
  selector: 'app-cu-descripcionpedido',
  standalone: false,
  templateUrl: './cu-descripcionpedido.component.html',
  styleUrl: './cu-descripcionpedido.component.css'
})
export class CuDescripcionpedidoComponent {

  @Input() descripcionPedido: DescripcionPedido | undefined;

}
