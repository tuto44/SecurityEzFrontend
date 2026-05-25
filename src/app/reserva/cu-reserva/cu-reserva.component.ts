import { Component, Input } from '@angular/core';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-cu-reserva',
  standalone: false,
  templateUrl: './cu-reserva.component.html',
  styleUrl: './cu-reserva.component.css'
})
export class CuReservaComponent {

@Input() reserva: Reserva | undefined;

}
