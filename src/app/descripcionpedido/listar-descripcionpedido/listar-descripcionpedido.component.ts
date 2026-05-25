import { Component, ElementRef, ViewChild } from '@angular/core';
import { DescripcionPedido } from '../../models/descripcionPedido';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { DescripcionPedidoService } from '../../services/descripcion-pedido.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-listar-descripcion-pedido',
  standalone: false,
  templateUrl: './listar-descripcionpedido.component.html',
  styleUrl: './listar-descripcionpedido.component.css'
})
export class ListarDescripcionPedidoComponent {

  @ViewChild('modalDescripcionPedido') modal: ElementRef | undefined;

  vectorDescripcionPedidos: DescripcionPedido[] = [];

  descripcionPedidoSelecionado: DescripcionPedido | undefined = undefined;
  isNew: boolean = false;

  constructor(
    private _descripcionPedidoService: DescripcionPedidoService, 
    private _util: UtilityService
  ) {
    this.LoadDescripcionPedidos();
  }

  isLoading = true;

  LoadDescripcionPedidos() {
    this.isLoading = true;
    this._descripcionPedidoService.getDescripcionPedidos().subscribe((rs) => {
      this.vectorDescripcionPedidos = rs;
      this.isLoading = false;
    });
  }

  EditarDescripcionPedido(descripcionPedido: DescripcionPedido) {
    this._util.AbrirModal(this.modal);
    this.descripcionPedidoSelecionado = descripcionPedido;
    this.isNew = false;
  }

  NuevoDescripcionPedido() {
    this._util.AbrirModal(this.modal);
    this.isNew = true;
    // Adaptado a campos comunes de un detalle o descripción de pedido
    this.descripcionPedidoSelecionado = { 
      IdDescripcionPedido: 0, 
      IdPedido: 0, 
      IdProducto: 0,
      Cantidad: 0,
      Precio: 0,
      MontoTotal: 0
    };
  }

  GuardarDescripcionPedido(){
    if(this.isNew){
      this._descripcionPedidoService.crearDescripcionPedido(this.descripcionPedidoSelecionado!).subscribe({next:(rs)=>{
          this.LoadDescripcionPedidos();
          this.descripcionPedidoSelecionado=undefined;
          this._util.CerrarModal(this.modal);
  
          Swal.fire({
            icon:'success',
            title:'DescripcionPedido creada',
          });
        },error:(err)=>{
          Swal.fire({
            icon:'error',
            title:'Error al crear descripcion pedido',
          });
        }
      });
    } else {
      this._descripcionPedidoService.editarDescripcionPedido(this.descripcionPedidoSelecionado!.IdDescripcionPedido, this.descripcionPedidoSelecionado!)
        .subscribe({
          next: () => {
            this.LoadDescripcionPedidos();
            this.descripcionPedidoSelecionado = undefined;
            this._util.CerrarModal(this.modal);
            Swal.fire({ icon: 'success', title: 'DescripcionPedido actualizada' });
          },
          error: () => {
            Swal.fire({ icon: 'error', title: 'Error al actualizar descripcion pedido' });
          }
        });
    }
  
  }
  
  EliminarDescripcionPedido(id:number){
  Swal.fire({
    icon:'question',
    title:'¿Desea eliminar la descripcion del pedido?',
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
      this._descripcionPedidoService.eliminarDescripcionPedido(id).subscribe({
        next:(rs)=>{
          this.LoadDescripcionPedidos();
          Swal.fire({
           icon:'success',
           title:'DescripcionPedido eliminada',
      });
    },
    error:(err)=>{
      Swal.fire({
       icon:'error',
       title:'Error al eliminar usuario',
          });
    }
      });
  
    }
  })
  }
}