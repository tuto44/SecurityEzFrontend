// src/app/guards/admin.guard.spec.ts
// Módulo: Autenticación
// Casos cubiertos: CU-03 (Guard — Acceso permitido solo a usuarios autenticados como Admin)

import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

// Mockeamos SweetAlert2 para evitar errores de DOM en el entorno de pruebas
jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: { fire: jest.fn() },
}));

describe('AdminGuard — CU-03: Validar acceso protegido', () => {
  let guard: AdminGuard;
  let mockAuthService: { estaLogueado: boolean; esAdmin: boolean };
  let mockRouter: { navigate: jest.Mock };

  beforeEach(() => {
    mockAuthService = {
      estaLogueado: false,
      esAdmin: false,
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    // Instanciamos directamente para evitar problemas de DI con emitDecoratorMetadata
    guard = new AdminGuard(
      mockAuthService as unknown as AuthService,
      mockRouter as unknown as Router
    );
  });

  // ── Camino feliz ────────────────────────────────────────────────────────────
  it('[CU-03 - camino feliz] debería permitir el acceso si el usuario está logueado y es Administrador', () => {
    mockAuthService.estaLogueado = true;
    mockAuthService.esAdmin = true;

    const resultado = guard.canActivate();

    expect(resultado).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  // ── Acceso denegado: cliente autenticado ────────────────────────────────────
  it('[CU-03 - error] debería denegar el acceso y redirigir a /home si el usuario es Cliente', () => {
    mockAuthService.estaLogueado = true;
    mockAuthService.esAdmin = false;

    const resultado = guard.canActivate();

    expect(resultado).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  // ── Acceso denegado: usuario no autenticado ─────────────────────────────────
  it('[CU-03 - error] debería denegar el acceso y redirigir a /home si el usuario no está logueado', () => {
    mockAuthService.estaLogueado = false;
    mockAuthService.esAdmin = false;

    const resultado = guard.canActivate();

    expect(resultado).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  // ── Borde: logueado pero sin rol admin ─────────────────────────────────────
  it('[CU-03 - borde] debería denegar el acceso si estaLogueado=true pero esAdmin=false', () => {
    mockAuthService.estaLogueado = true;
    mockAuthService.esAdmin = false;

    expect(guard.canActivate()).toBe(false);
  });
});
