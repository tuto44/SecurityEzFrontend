import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuProveedorComponent } from './cu-proveedor.component';

describe('CuProveedorComponent', () => {
  let component: CuProveedorComponent;
  let fixture: ComponentFixture<CuProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
