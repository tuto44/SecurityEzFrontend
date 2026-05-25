import { Component, ElementRef, ViewChild } from '@angular/core';
import { Reserva } from '../../models/reserva';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { ReservaService } from '../../services/reserva.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-listar-reserva',
  standalone: false,
  templateUrl: './listar-reserva.component.html',
  styleUrl: './listar-reserva.component.css'
})
export class ListarReservaComponent {

  @ViewChild('modalReserva') modal: ElementRef | undefined;

  vectorReservas: Reserva[] = [];

  reservaSelecionada: Reserva | undefined = undefined;
  isNew: boolean = false;

  constructor(
    private _reservaService: ReservaService, 
    private _util: UtilityService
  ) {
    this.LoadReservas();
  }

  isLoading = true;

  LoadReservas() {
    this.isLoading = true;
    this._reservaService.getReservas().subscribe((rs) => {
      this.vectorReservas = rs;
      this.isLoading = false;
    });
  }

  EditarReserva(reserva: Reserva) {
    this._util.AbrirModal(this.modal);
    this.reservaSelecionada = reserva;
    this.isNew = false;
  }

  NuevoReserva() {
    this._util.AbrirModal(this.modal);
    this.isNew = true;
    this.reservaSelecionada = { 
      IdReserva: 0,
      IdUsuario: 0,
      Fecha: new Date(),
      Estado: 'Pendiente'
    };
  }

GuardarReserva(){
  if(this.isNew){
    this._reservaService.crearReserva(this.reservaSelecionada!).subscribe({next:(rs)=>{
        this.LoadReservas();
        this.reservaSelecionada=undefined;
        this._util.CerrarModal(this.modal);

        Swal.fire({
          icon:'success',
          title:'Reserva creada',
        });
      },error:(err)=>{
        Swal.fire({
          icon:'error',
          title:'Error al crear reserva',
        });
      }
    });
  } else {
    this._reservaService.editarReserva(this.reservaSelecionada!.IdReserva, this.reservaSelecionada!)
      .subscribe({
        next: () => {
          this.LoadReservas();
          this.reservaSelecionada = undefined;
          this._util.CerrarModal(this.modal);
          Swal.fire({ icon: 'success', title: 'Reserva actualizada' });
        },
        error: () => {
          Swal.fire({ icon: 'error', title: 'Error al actualizar reserva' });
        }
      });
  }

}

EliminarReserva(id:number){
Swal.fire({
  icon:'question',
  title:'¿Desea eliminar la reserva?',
  showCancelButton:true,
  showConfirmButton:true,
  cancelButtonText:'Cancelar',
  confirmButtonText:'Eliminar',
  allowOutsideClick:false,
  buttonsStyling:false,
  reverseButtons:true,

  customClass:{
    cancelButton:'btn btn-secondary me-1',
    confirmButton:'btn btn-danger'
  }

}).then(rs=>{
  if(rs.isConfirmed){
    this._reservaService.eliminarReserva(id).subscribe({
      next:(rs)=>{
        this.LoadReservas();
        Swal.fire({
         icon:'success',
         title:'Reserva eliminada',
    });
  },
  error:(err)=>{
    Swal.fire({
     icon:'error',
     title:'Error al eliminar reserva',
        });
  }
    });

  }
})
}
}