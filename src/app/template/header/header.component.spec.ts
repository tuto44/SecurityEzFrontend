import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

describe('HeaderComponent', () => {

  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let authServiceMock: any;

  beforeEach(async () => {

    authServiceMock = {
      estaLogueado: true,
      esAdmin: true,
      esCliente: false,
      Logout: jest.fn(),
      usuarioActual$: new BehaviorSubject({
        Nombre: 'Ricardo',
        TipoUsuario: 'Administrador'
      })
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar usuario actual', () => {

    expect(component.currentUsuario).toBeTruthy();
    expect(component.currentUsuario.Nombre).toBe('Ricardo');

  });

  it('debe cerrar sesión', () => {

    component.logout();

    expect(authServiceMock.Logout).toHaveBeenCalled();

  });

  it('debe validar rol administrador', () => {

    expect(authServiceMock.esAdmin).toBeTruthy();

  });

});