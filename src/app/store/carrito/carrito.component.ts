import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { UtilityService } from '../../services/utility.service';
import { ElementoCarrito } from '../../models/elemento-carrito';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-carrito',
  standalone: false,
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  @ViewChild('modalPasarelaPago') modalPasarelaPago: ElementRef | undefined;
  
  listaCarrito: ElementoCarrito[] = [];
  totalCompra: number = 0;

  metodoPagoSeleccionado: string = 'tarjeta';

  // Datos simulados para el formulario de pago
  datosPago = { nombreCard: '', nroCard: '', expCard: '', cvcCard: '' };


  constructor(private _carritoService: CarritoService, private _pedidoService: PedidoService, private _utilityService: UtilityService, private _authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Nos suscribimos al observable del carrito para actualizar la vista 
    // automáticamente cada vez que el usuario sume, reste o borre algo.
    this._carritoService.carrito$.subscribe({
      next: (lista) => {
        this.listaCarrito = lista;
        this.totalCompra = this._carritoService.ObtenerTotal();
      }
    });
  }

  AumentarCantidad(item: ElementoCarrito) {
    // Reutilizamos el método de agregar que ya valida el stock máximo
    this._carritoService.AgregarAlCarrito(item.Producto);
  }

  RestarCantidad(idProducto: number) {
    this._carritoService.DecrementarCantidad(idProducto);
  }

  EliminarItem(idProducto: number) {
    this._carritoService.EliminarProducto(idProducto);
  }

  VaciarTodo() {
    this._carritoService.LimpiarCarrito();
  }


// 1. DISPARA EL MODAL DE PASARELA SIMULADA
  ProcesarCompra() {
    // Abrimos el modal de Bootstrap nativamente por ID usando la API de Bootstrap integrada en tu utilidad o de forma directa
    this._utilityService.AbrirModal(this.modalPasarelaPago);
  }

  // 2. EJECUTA LA TRANSACCIÓN FINAL
ConfirmarPagoSimulado() {
  this._utilityService.CerrarModal(this.modalPasarelaPago);

  Swal.fire({
    title: 'Procesando pago seguro...',
    text: 'Estamos validando los datos con tu entidad bancaria.',
    allowOutsideClick: false,
    didOpen: () => { Swal.showLoading(); }
  });

  setTimeout(() => {
    const pedidoDTO = {
      IdUsuario: this._authService.obtenerIdUsuario, 
      Total: this.totalCompra,
      Detalles: this.listaCarrito.map(item => ({
        IdProducto: item.Producto.IdProducto,
        Cantidad: item.Cantidad,
        Precio: item.Producto.Precio,
        MontoTotal: item.Producto.Precio * item.Cantidad
      }))
    };

    // LLAMADA REAL AL BACKEND
    this._pedidoService.registrarPedidoCompleto(pedidoDTO).subscribe({
      next: (res: any) => {
        Swal.close();
        this._carritoService.LimpiarCarrito();

        // ALERTA INTERACTIVA: Preguntamos si desea agendar instalación
        Swal.fire({
          icon: 'success',
          title: '¡Compra Finalizada con Éxito!',
          text: 'Tu pedido ha sido registrado. ¿Te gustaría agendar de una vez la instalación técnica de tus equipos?',
          showCancelButton: true,
          confirmButtonText: '<i class="bi bi-tools me-1"></i> Sí, agendar ahora',
          cancelButtonText: 'No, en otro momento',
          confirmButtonColor: '#FAB12F', // Amarillo/Naranja corporativo
          cancelButtonColor: '#6c757d',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            // Si el cliente dice que SÍ, lo mandamos al formulario público de reservas.
            // Le pasamos el ID del pedido recién creado en los queryParams por si tu backend lo asocia.
            // Asegúrate de que res traiga el IdPedido desde Node, por ejemplo: res.idGenerado
            const idPedidoCreado = res?.IdPedido || null; 

            this.router.navigate(['/store/agendar-reserva'], { 
              queryParams: { pedidoId: idPedidoCreado } 
            });
          } else {
            // Si dice que NO, lo mandamos al Home normal de la aplicación
            this.router.navigate(['/home']);
          }
        });
      },
      error: (err) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al procesar el pedido',
          text: 'Hubo un problema al registrar la compra en el servidor.',
          confirmButtonColor: '#DD0303'
        });
        console.error(err);
      }
    });

  }, 2500);
}
}