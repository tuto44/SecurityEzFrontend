import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ListarProveedorComponent } from './listar-proveedor.component';

describe('ListarProveedorComponent', () => {
  let component: ListarProveedorComponent;
  let fixture: ComponentFixture<ListarProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
