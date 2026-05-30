import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ListarCategoriaComponent } from './listar-categoria.component';

describe('ListarCategoriaComponent', () => {
  let component: ListarCategoriaComponent;
  let fixture: ComponentFixture<ListarCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
