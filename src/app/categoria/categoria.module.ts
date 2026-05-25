import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarCategoriaComponent } from './listar-categoria/listar-categoria.component';
import { CuCategoriaComponent } from './cu-categoria/cu-categoria.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const ROUTES: Routes=[
  {
    path: '',
    component:ListarCategoriaComponent
  }

]


@NgModule({
  declarations: [
    ListarCategoriaComponent,
    CuCategoriaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormsModule
  ]
})
export class CategoriaModule { }
