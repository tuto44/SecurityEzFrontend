import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarProductoComponent } from './listar-producto/listar-producto.component';
import { CuProductoComponent } from './cu-producto/cu-producto.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const ROUTES: Routes=[
  {
    path: '',
    component:ListarProductoComponent
  }

]

@NgModule({
  declarations: [
    ListarProductoComponent,
    CuProductoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormsModule
  ]
})
export class ProductoModule { }
