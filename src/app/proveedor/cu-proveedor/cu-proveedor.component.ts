import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cu-proveedor',
  standalone: false,
  templateUrl: './cu-proveedor.component.html',
  styleUrl: './cu-proveedor.component.css'
})
export class CuProveedorComponent {

  @Input() proveedor: any | undefined;
}
