import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuCategoriaComponent } from './cu-categoria.component';

describe('CuCategoriaComponent', () => {
  let component: CuCategoriaComponent;
  let fixture: ComponentFixture<CuCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
