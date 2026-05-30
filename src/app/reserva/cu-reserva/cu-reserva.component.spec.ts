import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { CuReservaComponent } from './cu-reserva.component';

describe('CuReservaComponent', () => {
  let component: CuReservaComponent;
  let fixture: ComponentFixture<CuReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
