import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { AgendarReservaComponent } from './agendarreserva.component';

describe('AgendarReservaComponent', () => {
  let component: AgendarReservaComponent;
  let fixture: ComponentFixture<AgendarReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendarReservaComponent],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
