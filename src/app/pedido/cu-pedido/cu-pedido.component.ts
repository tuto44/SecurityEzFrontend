import { Component, Input } from '@angular/core';
import { Pedido } from '../../models/pedido';

@Component({
  selector: 'app-cu-pedido',
  standalone: false,
  templateUrl: './cu-pedido.component.html',
  styleUrl: './cu-pedido.component.css'
})
export class CuPedidoComponent {

@Input() pedido: Pedido | undefined;

}
