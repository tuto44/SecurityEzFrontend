import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuDescripcionpedidoComponent } from './cu-descripcionpedido.component';

describe('CuDescripcionpedidoComponent', () => {
  let component: CuDescripcionpedidoComponent;
  let fixture: ComponentFixture<CuDescripcionpedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuDescripcionpedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuDescripcionpedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
