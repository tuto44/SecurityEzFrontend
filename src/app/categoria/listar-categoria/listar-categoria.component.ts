import { Component, ElementRef, ViewChild } from '@angular/core';
import { Categoria } from '../../models/categoria';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../services/categoria.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-listar-categoria',
  standalone: false,
  templateUrl: './listar-categoria.component.html',
  styleUrl: './listar-categoria.component.css'
})
export class ListarCategoriaComponent {

  @ViewChild('modalCategoria') modal: ElementRef | undefined;

  vectorCategorias: Categoria[] = [];

  categoriaSelecionada: Categoria | undefined = undefined;
  isNew: boolean = false;

  constructor(
    private _categoriaService: CategoriaService, 
    private _util: UtilityService
  ) {
    this.LoadCategorias();
  }

  isLoading = true;

  LoadCategorias() {
    this.isLoading = true;
    this._categoriaService.getCategorias().subscribe((rs) => {
      this.vectorCategorias = rs;
      this.isLoading = false;
    });
  }

  EditarCategoria(categoria: Categoria) {
    this._util.AbrirModal(this.modal);
    this.categoriaSelecionada = categoria;
    this.isNew = false;
  }

  NuevoCategoria() {
    this._util.AbrirModal(this.modal);
    this.isNew = true;
    // Ajustado a campos típicos de una categoría manteniendo la estructura original
    this.categoriaSelecionada = { 
      IdCategoria: 0, 
      Nombre: "", 
      Imagen: ""
    };
  }

GuardarCategoria(){
  if(this.isNew){
    this._categoriaService.crearCategoria(this.categoriaSelecionada!).subscribe({next:(rs)=>{
        this.LoadCategorias();
        this.categoriaSelecionada=undefined;
        this._util.CerrarModal(this.modal);

        Swal.fire({
          icon:'success',
          title:'Categoria creada',
        });
      },error:(err)=>{
        Swal.fire({
          icon:'error',
          title:'Error al crear categoria',
        });
      }
    });
  } else {
    this._categoriaService.editarCategoria(this.categoriaSelecionada!.IdCategoria, this.categoriaSelecionada!)
      .subscribe({
        next: () => {
          this.LoadCategorias();
          this.categoriaSelecionada = undefined;
          this._util.CerrarModal(this.modal);
          Swal.fire({ icon: 'success', title: 'Categoria actualizada' });
        },
        error: () => {
          Swal.fire({ icon: 'error', title: 'Error al actualizar categoria' });
        }
      });
  }

}

EliminarCategoria(id:number){
Swal.fire({
  icon:'question',
  title:'¿Desea eliminar la categoria?',
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
    this._categoriaService.eliminarCategoria(id).subscribe({
      next:(rs)=>{
        this.LoadCategorias();
        Swal.fire({
         icon:'success',
         title:'Categoria eliminada',
    });
  },
  error:(err)=>{
    Swal.fire({
     icon:'error',
     title:'Error al eliminar categoria',
        });
  }
    });

  }
})
}
}