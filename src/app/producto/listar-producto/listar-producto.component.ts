import { Component, ElementRef, ViewChild } from '@angular/core';
import { Producto } from '../../models/producto';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/producto.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-listar-producto',
  standalone: false,
  templateUrl: './listar-producto.component.html',
  styleUrl: './listar-producto.component.css'
})
export class ListarProductoComponent {

  @ViewChild('modalProducto') modal: ElementRef | undefined;

  vectorProductos: Producto[] = [];

  productoSeleccionado: Producto | undefined = undefined;
  isNew: boolean = false;

  constructor(
    private _productoService: ProductoService, 
    private _util: UtilityService
  ) {
    this.LoadProductos();
  }

  isLoading = true;

  LoadProductos() {
    this.isLoading = true;
    this._productoService.getProductos().subscribe((rs) => {
      this.vectorProductos = rs;
      this.isLoading = false;
    });
  }

  EditarProducto(producto: Producto) {
    this._util.AbrirModal(this.modal);
    this.productoSeleccionado = producto;
    this.isNew = false;
  }

  NuevoProducto() {
    this._util.AbrirModal(this.modal);
    this.isNew = true;
    this.productoSeleccionado = { 
      IdProducto: 0, 
      IdProveedor: 0, 
      IdCategoria: 0,
      Nombre: "", 
      Precio: 0, 
      Stock: 0, 
      Imagen: "",
      Descripcion: ""
    };
  }

GuardarProducto(){
  if(this.isNew){
    this._productoService.crearProducto(this.productoSeleccionado!).subscribe({next:(rs)=>{
        this.LoadProductos();
        this.productoSeleccionado=undefined;
        this._util.CerrarModal(this.modal);

        Swal.fire({
          icon:'success',
          title:'Producto creado',
        });
      },error:(err)=>{
        Swal.fire({
          icon:'error',
          title:'Error al crear producto',
        });
      }
    });
  } else {
    this._productoService.editarProducto(this.productoSeleccionado!.IdProducto, this.productoSeleccionado!)
      .subscribe({
        next: () => {
          this.LoadProductos();
          this.productoSeleccionado = undefined;
          this._util.CerrarModal(this.modal);
          Swal.fire({ icon: 'success', title: 'Producto actualizado' });
        },
        error: () => {
          Swal.fire({ icon: 'error', title: 'Error al actualizar producto' });
        }
      });
  }

}

EliminarProducto(id:number){
Swal.fire({
  icon:'question',
  title:'¿Desea eliminar el producto?',
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
    this._productoService.eliminarProducto(id).subscribe({
      next:(rs)=>{
        this.LoadProductos();
        Swal.fire({
         icon:'success',
         title:'Producto eliminado',
    });
  },
  error:(err)=>{
    Swal.fire({
     icon:'error',
     title:'Error al eliminar producto',
        });
  }
    });

  }
})
}
}