import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';
import { AdminGuard } from './guards/admin.guard';


const routes: Routes = [

{
 path:'home',
 component:HomeComponent,
},

{
  path:'usuario',
  loadChildren:()=> import('./usuario/usuario.module').then(m=>m.UsuarioModule),
  canActivate: [AdminGuard]
},

{
  path:'reserva',
  loadChildren:()=> import('./reserva/reserva.module').then(m=>m.ReservaModule),
  canActivate: [AdminGuard]

},

{
  path:'proveedor',
  loadChildren:()=> import('./proveedor/proveedor.module').then(m=>m.ProveedorModule),
  canActivate: [AdminGuard]

},
{
  path:'producto',
  loadChildren:()=> import('./producto/producto.module').then(m=>m.ProductoModule),
  canActivate: [AdminGuard]

},
{
  path:'pedido',
  loadChildren:()=> import('./pedido/pedido.module').then(m=>m.PedidoModule),
  canActivate: [AdminGuard]

},
{
  path:'descripcionpedido',
  loadChildren:()=> import('./descripcionpedido/descripcionpedido.module').then(m=>m.DescripcionpedidoModule),
  canActivate: [AdminGuard]

},
{
  path:'categoria',
  loadChildren:()=> import('./categoria/categoria.module').then(m=>m.CategoriaModule),
  canActivate: [AdminGuard]

},

{
  path:'store',
  loadChildren:()=> import('./store/store.module').then(m=>m.StoreModule)

},

{
  path:'login',
  component:LoginComponent 
},

{
  path:'registro',
  component:RegistroComponent
},

{
path:'**', redirectTo:'/home'
},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
