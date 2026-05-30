// src/app/services/auth.service.spec.ts
// Módulo: Autenticación
// Casos cubiertos: CU-01 (Login), CU-02 (Logout), CU-03 (VerificarSesion / acceso protegido)

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

// ─── Mocks de la librería JWT ────────────────────────────────────────────────
const mockDecodeToken = jest.fn();
const mockIsTokenExpired = jest.fn();

jest.mock('@auth0/angular-jwt', () => ({
  JwtHelperService: jest.fn().mockImplementation(() => ({
    decodeToken: mockDecodeToken,
    isTokenExpired: mockIsTokenExpired,
  })),
}));

// ─── Suite principal ─────────────────────────────────────────────────────────
describe('AuthService — Módulo de Autenticación', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiBase = environment.urlApiBase + 'usuario';

  // Datos de prueba reutilizables
  const mockTokenCliente = 'fake-jwt-cliente';
  const mockTokenAdmin   = 'fake-jwt-admin';
  const mockUserCliente  = { IdUsuario: 10, Nombre: 'Ricardo', TipoUsuario: 'Cliente' };
  const mockUserAdmin    = { IdUsuario: 1,  Nombre: 'Admin',   TipoUsuario: 'Administrador' };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    // Por defecto el token no está expirado
    mockIsTokenExpired.mockReturnValue(false);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    // Instanciamos directamente para evitar problemas de DI con emitDecoratorMetadata
    service = new AuthService(TestBed.inject(HttpClient));
  });

  afterEach(() => httpMock.verify());

  // ── Inicialización ──────────────────────────────────────────────────────────
  describe('Inicialización del servicio', () => {
    it('debería crearse correctamente', () => {
      expect(service).toBeTruthy();
    });

    it('debería iniciar con usuario nulo si no hay token en localStorage', () => {
      expect(service.estaLogueado).toBe(false);
    });
  });

  // ── CU-01: Iniciar sesión ───────────────────────────────────────────────────
  describe('CU-01 — Login: Iniciar sesión', () => {
    it('[camino feliz] debería almacenar el token y decodificar los datos del usuario', (done) => {
      mockDecodeToken.mockReturnValue(mockUserCliente);

      service.Login('ricardo', 'password123').subscribe((res) => {
        expect(res.token).toBe(mockTokenCliente);
        expect(localStorage.getItem('securityEZ_token')).toBe(mockTokenCliente);
        expect(service.estaLogueado).toBe(true);
        expect(service.esCliente).toBe(true);
        expect(service.esAdmin).toBe(false);
        expect(service.obtenerIdUsuario).toBe(10);
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ Usuario: 'ricardo', Contrasena: 'password123' });
      req.flush({ token: mockTokenCliente });
    });

    it('[camino feliz] debería reconocer al usuario como Administrador cuando el token lo indica', (done) => {
      mockDecodeToken.mockReturnValue(mockUserAdmin);

      service.Login('admin', 'admin123').subscribe(() => {
        expect(service.esAdmin).toBe(true);
        expect(service.esCliente).toBe(false);
        expect(service.obtenerIdUsuario).toBe(1);
        done();
      });

      httpMock.expectOne(`${apiBase}/login`).flush({ token: mockTokenAdmin });
    });

    it('[error] debería propagar el error HTTP cuando las credenciales son incorrectas', (done) => {
      service.Login('usuario_invalido', 'clave_incorrecta').subscribe({
        next: () => fail('No debería emitir un valor en caso de error'),
        error: (err) => {
          expect(err.status).toBe(401);
          expect(localStorage.getItem('securityEZ_token')).toBeNull();
          expect(service.estaLogueado).toBe(false);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/login`).flush(
        { message: 'Credenciales inválidas' },
        { status: 401, statusText: 'Unauthorized' }
      );
    });

    it('[error] debería manejar un error 500 del servidor', (done) => {
      service.Login('admin', 'admin').subscribe({
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/login`).flush(
        { message: 'Internal Server Error' },
        { status: 500, statusText: 'Server Error' }
      );
    });
  });

  // ── CU-02: Cerrar sesión ────────────────────────────────────────────────────
  describe('CU-02 — Logout: Cerrar sesión', () => {
    it('[camino feliz] debería eliminar el token del localStorage y limpiar el usuario actual', () => {
      localStorage.setItem('securityEZ_token', mockTokenCliente);

      service.Logout();

      expect(localStorage.getItem('securityEZ_token')).toBeNull();
      expect(service.estaLogueado).toBe(false);
      expect(service.esAdmin).toBe(false);
      expect(service.esCliente).toBe(false);
    });

    it('[camino feliz] debería emitir null en el observable usuarioActual$ al hacer logout', (done) => {
      // BehaviorSubject emite el valor actual al suscribirse (null inicial),
      // luego emite null de nuevo al hacer Logout(). Usamos skip(1) para ignorar la emisión inicial.
      let emisionCount = 0;
      service.usuarioActual$.subscribe((usuario) => {
        emisionCount++;
        if (emisionCount === 2) {
          // Segunda emisión: la que dispara Logout()
          expect(usuario).toBeNull();
          done();
        }
      });

      service.Logout();
    });

    it('[borde] debería ejecutarse sin errores aunque no haya sesión activa', () => {
      expect(() => service.Logout()).not.toThrow();
      expect(service.estaLogueado).toBe(false);
    });
  });

  // ── CU-03: Validar acceso protegido (VerificarSesion) ──────────────────────
  describe('CU-03 — VerificarSesion: Validar acceso protegido', () => {
    it('[camino feliz] debería restaurar la sesión si el token es válido y no ha expirado', () => {
      localStorage.setItem('securityEZ_token', mockTokenAdmin);
      mockIsTokenExpired.mockReturnValue(false);
      mockDecodeToken.mockReturnValue(mockUserAdmin);

      service.VerificarSesion();

      expect(service.estaLogueado).toBe(true);
      expect(service.esAdmin).toBe(true);
    });

    it('[error] debería hacer logout si el token ha expirado', () => {
      localStorage.setItem('securityEZ_token', 'token-expirado');
      mockIsTokenExpired.mockReturnValue(true);

      service.VerificarSesion();

      expect(localStorage.getItem('securityEZ_token')).toBeNull();
      expect(service.estaLogueado).toBe(false);
    });

    it('[borde] debería hacer logout si no existe ningún token en localStorage', () => {
      service.VerificarSesion();

      expect(service.estaLogueado).toBe(false);
    });

    it('[borde] obtenerIdUsuario debería retornar 1 como fallback si no hay usuario logueado', () => {
      service.Logout();
      expect(service.obtenerIdUsuario).toBe(1);
    });
  });

  // ── Registro público ────────────────────────────────────────────────────────
  describe('Registro: Registro público de clientes', () => {
    it('[camino feliz] debería enviar los datos del nuevo usuario al endpoint correcto', (done) => {
      const nuevoUsuario = {
        Nombre: 'Nuevo Cliente',
        Usuario: 'nuevo',
        Contrasena: 'pass123',
        TipoUsuario: 'Cliente',
      };

      service.Registro(nuevoUsuario).subscribe((res) => {
        expect(res).toEqual({ message: 'Usuario registrado' });
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevoUsuario);
      req.flush({ message: 'Usuario registrado' });
    });
  });
});
