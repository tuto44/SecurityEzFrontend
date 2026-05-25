import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoComponent } from './carrito/carrito.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgendarReservaComponent } from './agendarreserva/agendarreserva.component';

const ROUTES : Routes = [
  { path: 'catalogo', component: CatalogoComponent },          // Ruta normal (muestra todo)
  { path: 'catalogo/:idCat', component: CatalogoComponent },   // Ruta filtrada desde el Home
  { path: 'agendar-reserva', component: AgendarReservaComponent },
  { path: 'carrito', component: CarritoComponent }
];

@NgModule({
  declarations: [
    CarritoComponent,
    CatalogoComponent,
    AgendarReservaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormsModule
  ]
})
export class StoreModule { }
