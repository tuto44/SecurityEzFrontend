import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reserva } from '../../models/reserva';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agendar-reserva',
  standalone: false,
  templateUrl: './agendarreserva.component.html',
  styleUrl: './agendarreserva.component.css'
})
export class AgendarReservaComponent implements OnInit {

  // Inicializamos el modelo basándonos en tu interfaz Reserva
  nuevaReserva: Reserva = {
    IdReserva: 0,
    IdUsuario: 0,
    Fecha: new Date(),
    Estado: 'Pendiente'
  };

  constructor(
    private _reservaService: ReservaService,
    private _authService: AuthService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // 1. Asignamos el ID del usuario logueado dinámicamente (ej: ID 4)
    this.nuevaReserva.IdUsuario = this._authService.obtenerIdUsuario;

    // 2. Si viene de finalizar una compra, capturamos el ID del pedido por si tu tabla lo requiere
    this._activatedRoute.queryParams.subscribe(params => {
      if (params['pedidoId']) {
        // Si tu modelo maneja IdPedido opcional, lo asignas aquí:
        // this.nuevaReserva.IdPedido = +params['pedidoId'];
      }
    });
  }

  ProcesarAgenda() {
    this._reservaService.crearReserva(this.nuevaReserva).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Instalación Agendada!',
          text: 'Hemos registrado tu solicitud. Un técnico se pondrá en contacto contigo.',
          confirmButtonColor: '#FAB12F'
        });
        this._router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo programar la instalación en este momento.'
        });
      }
    });
  }
}