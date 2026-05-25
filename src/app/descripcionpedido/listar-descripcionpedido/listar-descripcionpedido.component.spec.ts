import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDescripcionpedidoComponent } from './listar-descripcionpedido.component';

describe('ListarDescripcionpedidoComponent', () => {
  let component: ListarDescripcionpedidoComponent;
  let fixture: ComponentFixture<ListarDescripcionpedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarDescripcionpedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarDescripcionpedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
