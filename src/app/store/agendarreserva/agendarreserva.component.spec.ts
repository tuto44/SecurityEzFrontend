import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarreservaComponent } from './agendarreserva.component';

describe('AgendarreservaComponent', () => {
  let component: AgendarreservaComponent;
  let fixture: ComponentFixture<AgendarreservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendarreservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarreservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
