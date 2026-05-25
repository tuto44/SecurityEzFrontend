import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo',
  standalone: false,
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {
  vectorProductos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  idCategoriaSeleccionada: number | null = null;
  isLoading = true;

  productoParaDetalle: Producto | undefined = undefined;

  constructor(
    private _productoService: ProductoService,
    private _route: ActivatedRoute,
    private _carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    // Escucha cambios en los parámetros de la URL de manera dinámica
    this._route.params.subscribe(params => {
      if (params['idCat']) {
        this.idCategoriaSeleccionada = +params['idCat']; // El '+' lo convierte a número
      } else {
        this.idCategoriaSeleccionada = null;
      }
      this.LoadProductos();
    });
  }

  LoadProductos() {
    this.isLoading = true;
    this._productoService.getProductos().subscribe({
      next: (rs) => {
        this.vectorProductos = rs;
        this.FiltrarProductos();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  FiltrarProductos() {
    if (this.idCategoriaSeleccionada) {
      this.productosFiltrados = this.vectorProductos.filter(
        p => p.IdCategoria === this.idCategoriaSeleccionada
      );
    } else {
      this.productosFiltrados = this.vectorProductos;
    }
  }

  VerDetalles(producto: Producto) {
    this.productoParaDetalle = producto;
  }

  // NUEVO MÉTODO: ACCIÓN DEL BOTÓN COMPRAR
  AgregarProductoAlCarrito(producto: Producto) {
    const agregado = this._carritoService.AgregarAlCarrito(producto);

    if (agregado) {
      // Toast pequeño flotante en la esquina superior derecha
      Swal.fire({
        text: 'Producto añadido al carrito',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    } else {
      // Alerta si ya se solicitó el máximo disponible
      Swal.fire({
        title: '¡No hay suficiente Stock!',
        text: `No puedes agregar más unidades de ${producto.Nombre}.`,
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
    }
  }
}
