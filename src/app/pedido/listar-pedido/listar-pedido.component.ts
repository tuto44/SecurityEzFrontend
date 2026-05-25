import { Component, ElementRef, ViewChild } from '@angular/core';
import { Pedido } from '../../models/pedido';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { PedidoService } from '../../services/pedido.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-listar-pedido',
  standalone: false,
  templateUrl: './listar-pedido.component.html',
  styleUrl: './listar-pedido.component.css'
})
export class ListarPedidoComponent {

  @ViewChild('modalPedido') modal: ElementRef | undefined;

  vectorPedidos: Pedido[] = [];

  pedidoSeleccionado: Pedido | undefined = undefined;
  isNew: boolean = false;

  constructor(
    private _pedidoService: PedidoService, 
    private _util: UtilityService
  ) {
    this.LoadPedidos();
  }

  isLoading = true;

  LoadPedidos() {
    this.isLoading = true;
    this._pedidoService.getPedidos().subscribe((rs) => {
      this.vectorPedidos = rs;
      this.isLoading = false;
    });
  }

  EditarPedido(pedido: Pedido) {
    this._util.AbrirModal(this.modal);
    this.pedidoSeleccionado = pedido;
    this.isNew = false;
  }

  NuevoPedido() {
    this._util.AbrirModal(this.modal);
    this.isNew = true;
    this.pedidoSeleccionado = { 
      IdPedido: 0, 
      IdUsuario: 0,
      Fecha: new Date(),
      Total: 0, 
    };
  }

GuardarPedido(){
  if(this.isNew){
    this._pedidoService.crearPedido(this.pedidoSeleccionado!).subscribe({next:(rs)=>{
        this.LoadPedidos();
        this.pedidoSeleccionado=undefined;
        this._util.CerrarModal(this.modal);

        Swal.fire({
          icon:'success',
          title:'Pedido creado',
        });
      },error:(err)=>{
        Swal.fire({
          icon:'error',
          title:'Error al crear pedido',
        });
      }
    });
  } else {
    this._pedidoService.editarPedido(this.pedidoSeleccionado!.IdPedido, this.pedidoSeleccionado!)
      .subscribe({
        next: () => {
          this.LoadPedidos();
          this.pedidoSeleccionado = undefined;
          this._util.CerrarModal(this.modal);
          Swal.fire({ icon: 'success', title: 'Pedido actualizado' });
        },
        error: () => {
          Swal.fire({ icon: 'error', title: 'Error al actualizar pedido' });
        }
      });
  }

}

EliminarPedido(id:number){
Swal.fire({
  icon:'question',
  title:'¿Desea eliminar el pedido?',
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
    this._pedidoService.eliminarPedido(id).subscribe({
      next:(rs)=>{
        this.LoadPedidos();
        Swal.fire({
         icon:'success',
         title:'Pedido eliminado',
    });
  },
  error:(err)=>{
    Swal.fire({
     icon:'error',
     title:'Error al eliminar pedido',
        });
  }
    });

  }
})
}
}