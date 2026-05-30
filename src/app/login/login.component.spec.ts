// src/app/login/login.component.spec.ts
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('LoginComponent (Pruebas Unitarias)', () => {
  let component: LoginComponent;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      Login: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    // Espiamos SweetAlert para que no levante alertas reales en la consola de Jest
    jest.spyOn(Swal, 'fire').mockImplementation(() => Promise.resolve({} as any));

    component = new LoginComponent(authServiceMock, routerMock);
  });

  it('[CU-35] - Debería mostrar advertencia si el usuario o contraseña están vacíos', () => {
    component.usr = '   ';
    component.pwd = '123';

    component.login();

    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'warning',
      title: 'Campos vacíos',
      confirmButtonColor: '#FAB12F'
    }));
    expect(authServiceMock.Login).not.toHaveBeenCalled();
  });

  it('[CU-01 / CU-35] - Debería procesar login exitoso, activar loading, disparar Toast y redirigir', () => {
    component.usr = 'admin';
    component.pwd = 'admin123';
    
    const resMock = { user: { Nombre: 'Lucas' }, token: 'abc' };
    authServiceMock.Login.mockReturnValue(of(resMock));

    component.login();

    expect(component.isLoading).toBe(false);
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      text: '¡Bienvenido de nuevo, Lucas!',
      icon: 'success',
      toast: true
    }));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('[CU-35] - Debería manejar errores de autenticación del backend correctamente', () => {
    component.usr = 'errorUser';
    component.pwd = 'wrongPass';

    const errMock = { error: { message: 'Credenciales inválidas' } };
    authServiceMock.Login.mockReturnValue(throwError(() => errMock));

    component.login();

    expect(component.isLoading).toBe(false);
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'error',
      title: 'Error de autenticación',
      text: 'Credenciales inválidas',
      confirmButtonColor: '#DD0303'
    }));
  });
});