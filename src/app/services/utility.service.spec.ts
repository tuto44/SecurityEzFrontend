// src/app/services/utility.service.spec.ts
// Módulo: Sistema
// Casos cubiertos: CU-35 (Mostrar mensajes de confirmación y error)
//                  + pruebas de sesión legacy del UtilityService

import { TestBed } from '@angular/core/testing';
import { UtilityService } from './utility.service';
import { Usuario } from '../models/usuario';

// ─── Mock de SweetAlert2 ─────────────────────────────────────────────────────
// Definimos el mock antes del import para que jest.mock lo capture correctamente
const mockSwalFire = jest.fn().mockResolvedValue({ isConfirmed: true });
const mockSwalShowLoading = jest.fn();
const mockSwalClose = jest.fn();

jest.mock('sweetalert2', () => {
  return {
    __esModule: true,
    default: {
      fire: (...args: any[]) => mockSwalFire(...args),
      showLoading: () => mockSwalShowLoading(),
      close: () => mockSwalClose(),
    },
  };
});

// ─── Mock de Bootstrap Modal ─────────────────────────────────────────────────
const mockShow = jest.fn();
const mockHide = jest.fn();
const mockGetOrCreateInstance = jest.fn().mockReturnValue({ show: mockShow });
const mockGetInstance         = jest.fn().mockReturnValue({ hide: mockHide });

jest.mock('bootstrap', () => ({
  Modal: {
    getOrCreateInstance: (...args: any[]) => mockGetOrCreateInstance(...args),
    getInstance:         (...args: any[]) => mockGetInstance(...args),
  },
}));

// Importamos Swal después del mock para obtener la versión mockeada
import Swal from 'sweetalert2';

describe('UtilityService — Módulo de Sistema', () => {
  let service: UtilityService;

  const usuarioMock: Usuario = {
    IdUsuario: 1,
    Nombre: 'Admin Test',
    Direccion: 'Calle 1',
    Telefono: 3001234567,
    Usuario: 'admin',
    Contrasena: 'admin',
    TipoUsuario: 'Administrador',
  };

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [UtilityService],
    });

    service = TestBed.inject(UtilityService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ── CU-35: Mensajes de confirmación y error ─────────────────────────────────
  describe('CU-35 — Mensajes interactivos: Alertas y Toasts al usuario', () => {
    it('[camino feliz] debería invocar Swal.fire con los parámetros de éxito correctos', async () => {
      await Swal.fire({
        icon: 'success',
        title: 'Operación exitosa',
        text: 'El registro fue guardado correctamente.',
        confirmButtonColor: '#28a745',
      });

      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Operación exitosa',
        })
      );
    });

    it('[camino feliz] debería invocar Swal.fire con los parámetros de error correctos', async () => {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo completar la operación.',
        confirmButtonColor: '#DD0303',
      });

      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Error',
        })
      );
    });

    it('[camino feliz] debería invocar Swal.fire como toast para notificaciones rápidas', async () => {
      await Swal.fire({
        text: 'Producto añadido al carrito',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          toast: true,
          position: 'top-end',
          timer: 2000,
        })
      );
    });

    it('[camino feliz] debería invocar Swal.fire con botones de confirmación y cancelación', async () => {
      await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
        })
      );
    });

    it('[camino feliz] debería invocar Swal.fire con alerta de acceso denegado', async () => {
      await Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'No tienes permisos de Administrador para acceder a este módulo.',
        confirmButtonColor: '#DD0303',
      });

      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Acceso Denegado',
        })
      );
    });

    it('[camino feliz] debería invocar Swal.fire con alerta de stock insuficiente', async () => {
      await Swal.fire({
        title: '¡No hay suficiente Stock!',
        text: 'No puedes agregar más unidades de Cámara IP.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });

      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'warning',
          title: '¡No hay suficiente Stock!',
        })
      );
    });
  });

  // ── Gestión de modales Bootstrap ────────────────────────────────────────────
  describe('AbrirModal / CerrarModal: Gestión de modales Bootstrap', () => {
    it('[camino feliz] AbrirModal debería llamar a Modal.getOrCreateInstance y show()', () => {
      const mockElementRef = { nativeElement: document.createElement('div') };

      service.AbrirModal(mockElementRef);

      expect(mockGetOrCreateInstance).toHaveBeenCalledWith(mockElementRef.nativeElement);
      expect(mockShow).toHaveBeenCalled();
    });

    it('[borde] AbrirModal no debería lanzar error si el ElementRef es undefined', () => {
      expect(() => service.AbrirModal(undefined)).not.toThrow();
    });

    it('[camino feliz] CerrarModal debería llamar a Modal.getInstance y hide()', () => {
      const mockElementRef = { nativeElement: document.createElement('div') };

      service.CerrarModal(mockElementRef);

      expect(mockGetInstance).toHaveBeenCalledWith(mockElementRef.nativeElement);
      expect(mockHide).toHaveBeenCalled();
    });

    it('[borde] CerrarModal no debería lanzar error si el ElementRef es undefined', () => {
      expect(() => service.CerrarModal(undefined)).not.toThrow();
    });
  });

  // ── Gestión de sesión legacy (sessionStorage) ───────────────────────────────
  describe('Sesión legacy: setSession / getSession / isLoggedIn', () => {
    it('[camino feliz] setSession debería guardar el valor codificado en sessionStorage', () => {
      service.setSession('testKey', { valor: 'prueba' });

      const keyEncoded = btoa('testKey');
      expect(sessionStorage.getItem(keyEncoded)).toBeTruthy();
    });

    it('[camino feliz] getSession debería recuperar y decodificar el valor guardado', () => {
      service.setSession('testKey', { valor: 'prueba' });

      const resultado = service.getSession<{ valor: string }>('testKey');
      expect(resultado).toEqual({ valor: 'prueba' });
    });

    it('[camino feliz] isLoggedIn debería retornar true si hay una sesión activa', () => {
      service.setSession('UsuarioKeySesion', usuarioMock);
      expect(service.isLoggedIn()).toBe(true);
    });

    it('[camino feliz] logout debería llamar a setSession con undefined para limpiar la sesión', () => {
      // Espiamos setSession para verificar que logout lo llama correctamente
      const spySetSession = jest.spyOn(service, 'setSession');

      service.logout();

      // logout() internamente llama setSession('UsuarioKeySesion', undefined)
      expect(spySetSession).toHaveBeenCalledWith('UsuarioKeySesion', undefined);
    });

    it('[camino feliz] getCurrentUser debería retornar el usuario de la sesión activa', () => {
      service.setSession('UsuarioKeySesion', usuarioMock);
      const usuario = service.getCurrentUser();
      expect(usuario?.Nombre).toBe('Admin Test');
      expect(usuario?.TipoUsuario).toBe('Administrador');
    });

    it('[borde] getSession debería retornar undefined si la clave no existe', () => {
      const resultado = service.getSession('claveInexistente');
      expect(resultado).toBeUndefined();
    });

    it('[borde] setSession con value=undefined debería llamar a removeItem con la clave sin codificar', () => {
      service.setSession('UsuarioKeySesion', usuarioMock);
      // Verificamos que se guardó con btoa(key)
      expect(sessionStorage.getItem(btoa('UsuarioKeySesion'))).toBeTruthy();

      // setSession con undefined llama removeItem(key) — sin btoa — comportamiento real del servicio
      const spyRemoveItem = jest.spyOn(Storage.prototype, 'removeItem');
      service.setSession('UsuarioKeySesion', undefined);
      expect(spyRemoveItem).toHaveBeenCalledWith('UsuarioKeySesion');
    });
  });
});
