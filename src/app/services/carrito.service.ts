import { Injectable } from '@angular/core';
import { ElementoCarrito } from '../models/elemento-carrito';
import { Producto } from '../models/producto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  
  // Usamos BehaviorSubject para que cualquier componente (como el navbar) pueda 
  // enterarse en tiempo real de cuántos productos hay en el carrito.
  private _carrito = new BehaviorSubject<ElementoCarrito[]>([]);
  carrito$ = this._carrito.asObservable();

  constructor() {
    this.CargarCarrito();
  }

  // 1. OBTENER EL LISTADO ACTUAL DEL CARRITO
  get obtenerLista(): ElementoCarrito[] {
    return this._carrito.getValue();
  }

  // 2. AGREGAR UN PRODUCTO AL CARRITO
  AgregarAlCarrito(producto: Producto): boolean {
    const listaActual = [...this.obtenerLista];
    const itemExistente = listaActual.find(item => item.Producto.IdProducto === producto.IdProducto);

    // Si el producto no tiene stock disponible
    if (producto.Stock <= 0) return false;

    if (itemExistente) {
      // Validamos que no supere el stock real de la base de datos
      if (itemExistente.Cantidad < producto.Stock) {
        itemExistente.Cantidad++;
      } else {
        return false; // No hay suficiente stock para agregar más
      }
    } else {
      // Si es nuevo, lo añadimos con cantidad 1
      listaActual.push({ Producto: producto, Cantidad: 1 });
    }

    this.ActualizarEstado(listaActual);
    return true;
  }

  // 3. RESTAR UNA UNIDAD A LA CANTIDAD DE UN PRODUCTO
  DecrementarCantidad(idProducto: number) {
    let listaActual = [...this.obtenerLista];
    const item = listaActual.find(item => item.Producto.IdProducto === idProducto);

    if (item) {
      item.Cantidad--;
      // Si la cantidad llega a 0, lo removemos por completo del carrito
      if (item.Cantidad <= 0) {
        listaActual = listaActual.filter(item => item.Producto.IdProducto !== idProducto);
      }
      this.ActualizarEstado(listaActual);
    }
  }

  // 4. ELIMINAR UN PRODUCTO COMPLETAMENTE DEL CARRITO (Botón de basura)
  EliminarProducto(idProducto: number) {
    const listaActual = this.obtenerLista.filter(item => item.Producto.IdProducto !== idProducto);
    this.ActualizarEstado(listaActual);
  }

  // 5. CALCULAR EL PRECIO TOTAL DE LA COMPRA
  ObtenerTotal(): number {
    return this.obtenerLista.reduce((acc, item) => acc + (item.Producto.Precio * item.Cantidad), 0);
  }

  // 6. CALCULAR EL TOTAL DE UNIDADES EN EL CARRITO (Para poner una burbuja en el menú)
  ObtenerTotalUnidades(): number {
    return this.obtenerLista.reduce((acc, item) => acc + item.Cantidad, 0);
  }

  // 7. VACIAR EL CARRITO COMPLETAMENTE
  LimpiarCarrito() {
    this.ActualizarEstado([]);
  }

  // ==========================================
  // MÉTODOS PRIVADOS DE PERSISTENCIA (localStorage)
  // ==========================================
  private ActualizarEstado(nuevaLista: ElementoCarrito[]) {
    this._carrito.next(nuevaLista);
    localStorage.setItem('securityEZ_cart', JSON.stringify(nuevaLista));
  }

  private CargarCarrito() {
    const carritoGuardado = localStorage.getItem('securityEZ_cart');
    if (carritoGuardado) {
      try {
        this._carrito.next(JSON.parse(carritoGuardado));
      } catch (e) {
        this._carrito.next([]);
      }
    }
  }
}