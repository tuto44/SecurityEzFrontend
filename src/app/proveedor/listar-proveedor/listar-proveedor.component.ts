import { Component, ElementRef, ViewChild } from '@angular/core';
import { Proveedor } from '../../models/proveedor';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { ProveedorService } from '../../services/proveedor.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-listar-proveedor',
  standalone: false,
  templateUrl: './listar-proveedor.component.html',
  styleUrl: './listar-proveedor.component.css'
})
export class ListarProveedorComponent {

  @ViewChild('modalProveedor') modal: ElementRef | undefined;

  vectorProveedores: Proveedor[] = [];

  proveedorSeleccionado: Proveedor | undefined = undefined;
  isNew: boolean = false;

  constructor(
    private _proveedorService: ProveedorService, 
    private _util: UtilityService
  ) {
    this.LoadProveedores();
  }

  isLoading = true;

  LoadProveedores() {
    this.isLoading = true;
    this._proveedorService.getProveedores().subscribe((rs) => {
      this.vectorProveedores = rs;
      this.isLoading = false;
    });
  }

  EditarProveedor(proveedor: Proveedor) {
    this._util.AbrirModal(this.modal);
    this.proveedorSeleccionado = proveedor;
    this.isNew = false;
  }

  NuevoProveedor() {
    this._util.AbrirModal(this.modal);
    this.isNew = true;
    this.proveedorSeleccionado = { 
      IdProveedor: 0,
      Nombre: "",
      Direccion: "",
      Telefono: 0
      
    };
  }

GuardarProveedor(){
  if(this.isNew){
    this._proveedorService.crearProveedor(this.proveedorSeleccionado!).subscribe({next:(rs)=>{
        this.LoadProveedores();
        this.proveedorSeleccionado=undefined;
        this._util.CerrarModal(this.modal);

        Swal.fire({
          icon:'success',
          title:'Proveedor creado',
        });
      },error:(err)=>{
        Swal.fire({
          icon:'error',
          title:'Error al crear proveedor',
        });
      }
    });
  } else {
    this._proveedorService.editarProveedor(this.proveedorSeleccionado!.IdProveedor, this.proveedorSeleccionado!)
      .subscribe({
        next: () => {
          this.LoadProveedores();
          this.proveedorSeleccionado = undefined;
          this._util.CerrarModal(this.modal);
          Swal.fire({ icon: 'success', title: 'Proveedor actualizado' });
        },
        error: () => {
          Swal.fire({ icon: 'error', title: 'Error al actualizar proveedor' });
        }
      });
  }

}

  EliminarProveedor(id:number){
  Swal.fire({
    icon:'question',
    title:'¿Desea eliminar el proveedor?',
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
      this._proveedorService.eliminarProveedor(id).subscribe({
        next:(rs)=>{
          this.LoadProveedores();
          Swal.fire({
           icon:'success',
           title:'Proveedor eliminado',
      });
    },
    error:(err)=>{
      Swal.fire({
       icon:'error',
       title:'Error al eliminar proveedor',
          });
    }
      });
  
    }
  })
  }
}