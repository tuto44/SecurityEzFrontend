import { Component, ElementRef, ViewChild } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-listar-usuario',
  standalone: false,
  templateUrl: './listar-usuario.component.html',
  styleUrl: './listar-usuario.component.css'
})
export class ListarUsuarioComponent {

@ViewChild('modalUsuario') modal: ElementRef | undefined;


vectorUsuarios: Usuario[]=[

];

usuarioSelecionado:Usuario |undefined =undefined;
isNew:boolean=false;

constructor(private _usuarioService: UsuarioService,private _util: UtilityService) {

  this.LoadUsuarios();

 }

 isLoading=true;

 LoadUsuarios(){
  this.isLoading=true;
  this._usuarioService.getUsuarios().subscribe((rs)=>{
    console.log(rs);
    this.vectorUsuarios=rs;
    this.isLoading=false;
  })
 }

EditarUsuario(usuario:Usuario){
  this._util.AbrirModal(this.modal);
  this.usuarioSelecionado=usuario;
  this.isNew=false;

}

NuevoUsuario(){
  this._util.AbrirModal(this.modal);
  this.isNew=true;
  this.usuarioSelecionado={IdUsuario:0,Nombre:"",Direccion:"",Telefono:0,Usuario:"",Contrasena:"",TipoUsuario:'Cliente'};
}

GuardarUsuario(){
  if(this.isNew){
    this._usuarioService.crearUsuario(this.usuarioSelecionado!).subscribe({next:(rs)=>{
        this.LoadUsuarios();
        this.usuarioSelecionado=undefined;
        this._util.CerrarModal(this.modal);

        Swal.fire({
          icon:'success',
          title:'Usuario creado',
        });
      },error:(err)=>{
        Swal.fire({
          icon:'error',
          title:'Error al crear usuario',
        });
      }
    });
  } else {
    this._usuarioService.editarUsuario(this.usuarioSelecionado!.IdUsuario, this.usuarioSelecionado!)
      .subscribe({
        next: () => {
          this.LoadUsuarios();
          this.usuarioSelecionado = undefined;
          this._util.CerrarModal(this.modal);
          Swal.fire({ icon: 'success', title: 'Usuario actualizado' });
        },
        error: () => {
          Swal.fire({ icon: 'error', title: 'Error al actualizar usuario' });
        }
      });
  }

}

EliminarUsuario(id:number){
Swal.fire({
  icon:'question',
  title:'¿Desea eliminar el usuario?',
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
    this._usuarioService.eliminarUsuario(id).subscribe({
      next:(rs)=>{
        this.LoadUsuarios();
        Swal.fire({
         icon:'success',
         title:'Usuario eliminado',
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
