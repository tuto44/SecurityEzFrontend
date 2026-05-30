import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ListarReservaComponent } from './listar-reserva.component';

describe('ListarReservaComponent', () => {
  let component: ListarReservaComponent;
  let fixture: ComponentFixture<ListarReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
