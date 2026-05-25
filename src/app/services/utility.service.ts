import { ElementRef, Injectable } from '@angular/core';
import { Modal } from 'bootstrap';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  private sesionKey='UsuarioKeySesion';


  constructor() { }

login(usr: string, pwd: string):Observable<boolean>{
    return new Observable(subs=>{
      let rs = usr === 'admin' && pwd === 'admin';
      this.setSession(this.sesionKey,{IdUsuario:1, Nombre:'Admin', Direccion:'verve', Telefono:0, Usuario:"admin", Contrasena:"admin", TipoUsuario:'Administrador'});
      subs.next(rs)
      subs.complete();
    })
}

getCurrentUser(): Usuario | undefined{
  return this.getSession<Usuario>(this.sesionKey);
}

logout(){
  this.setSession(this.sesionKey, undefined);
  
}

isLoggedIn():boolean{
  let usr=this.getSession(this.sesionKey);
  return (usr != undefined);
}

getSession<T>(key:string){
 let obj=sessionStorage.getItem(btoa(key));
  if(obj)
    return JSON.parse(atob(obj)) as T;
  else 
    return undefined;
}

  setSession(key:string, value:any){
    if(value){
      sessionStorage.setItem(btoa(key), btoa(JSON.stringify(value)));
    } else{
      sessionStorage.removeItem(key);
    }
  }

AbrirModal(modal:ElementRef | undefined){
    if(modal){
      let bsModal=Modal.getOrCreateInstance(modal.nativeElement);
      bsModal.show();
    }
}

  CerrarModal(modal:ElementRef | undefined){
if(modal){
 let bsModal=Modal.getInstance(modal?.nativeElement);
 bsModal?.hide();

 let backdrop=document.querySelector('.modal-backdrop.fade.show');
 if(backdrop){
  backdrop.parentNode?.removeChild(backdrop);
 }

 document.body.removeAttribute('style');
 document.body.removeAttribute('class');
}

}

}
