import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarDescripcionPedidoComponent } from './listar-descripcionpedido/listar-descripcionpedido.component';
import { CuDescripcionpedidoComponent } from './cu-descripcionpedido/cu-descripcionpedido.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const ROUTES: Routes=[
  {
    path: '',
    component:ListarDescripcionPedidoComponent
  }

]


@NgModule({
  declarations: [
    ListarDescripcionPedidoComponent,
    CuDescripcionpedidoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormsModule
  ]
})
export class DescripcionpedidoModule { }
