import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { CuUsuarioComponent } from './cu-usuario.component';

describe('CuUsuarioComponent', () => {
  let component: CuUsuarioComponent;
  let fixture: ComponentFixture<CuUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
