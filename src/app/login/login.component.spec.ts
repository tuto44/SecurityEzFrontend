import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {

    authServiceMock = {
      Login: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar sesión correctamente', () => {

    const responseMock = {
      token: 'fake-token',
      user: {
        Nombre: 'Ricardo'
      }
    };

    authServiceMock.Login.mockReturnValue(of(responseMock));

    component.usr = 'admin';
    component.pwd = '123456';

    component.login();

    expect(authServiceMock.Login).toHaveBeenCalledWith('admin', '123456');
    expect(component.isLoading).toBeFalsy();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);

  });

  it('debe mostrar error si las credenciales son incorrectas', () => {

    authServiceMock.Login.mockReturnValue(
      throwError(() => ({
        error: {
          message: 'Usuario o contraseña incorrectos'
        }
      }))
    );

    component.usr = 'admin';
    component.pwd = 'incorrecta';

    component.login();

    expect(authServiceMock.Login).toHaveBeenCalled();
    expect(component.isLoading).toBeFalsy();

  });

  it('no debe iniciar sesión con campos vacíos', () => {

    component.usr = '';
    component.pwd = '';

    component.login();

    expect(authServiceMock.Login).not.toHaveBeenCalled();

  });

});