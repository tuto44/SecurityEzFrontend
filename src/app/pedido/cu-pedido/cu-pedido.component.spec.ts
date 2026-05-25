import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuPedidoComponent } from './cu-pedido.component';

describe('CuPedidoComponent', () => {
  let component: CuPedidoComponent;
  let fixture: ComponentFixture<CuPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
