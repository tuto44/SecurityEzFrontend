import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuProductoComponent } from './cu-producto.component';

describe('CuProductoComponent', () => {
  let component: CuProductoComponent;
  let fixture: ComponentFixture<CuProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
