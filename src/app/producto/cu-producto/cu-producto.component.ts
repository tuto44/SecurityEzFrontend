import { Component, Input } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProveedorService } from '../../services/proveedor.service';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-cu-producto',
  standalone: false,
  templateUrl: './cu-producto.component.html',
  styleUrl: './cu-producto.component.css'
})
export class CuProductoComponent {

 @Input() producto: Producto | undefined;

listaCategorias: any[] = [];
listaProveedores: any[] = [];

constructor(
    private _categoriaService: CategoriaService,
    private _proveedorService: ProveedorService
  ) { }

ngOnInit(): void {
    this.cargarSelects();
  }
  
cargarSelects() {
    // 1. Traer categorías
    this._categoriaService.getCategorias().subscribe({
      next: (res) => this.listaCategorias = res,
      error: (err) => console.error('Error al cargar categorías', err)
    });

    // 2. Traer proveedores
    this._proveedorService.getProveedores().subscribe({
      next: (res) => this.listaProveedores = res,
      error: (err) => console.error('Error al cargar proveedores', err)
    });
  }

}
