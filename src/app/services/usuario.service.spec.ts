// src/app/services/usuario.service.spec.ts
// Módulo: Usuarios
// Casos cubiertos: CU-04 (Registrar), CU-05 (Editar), CU-06 (Eliminar), CU-07 (Consultar)

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment';

describe('UsuarioService — Módulo de Usuarios', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  const apiBase = environment.urlApiBase + 'usuario';

  // ── Datos de prueba ─────────────────────────────────────────────────────────
  const usuarioMock: Usuario = {
    IdUsuario: 1,
    Nombre: 'Ricardo Pérez',
    Direccion: 'Calle 123',
    Telefono: 3001234567,
    Usuario: 'rperez',
    Contrasena: 'pass123',
    TipoUsuario: 'Cliente',
  };

  const listaUsuariosMock: Usuario[] = [
    usuarioMock,
    {
      IdUsuario: 2,
      Nombre: 'Ana García',
      Direccion: 'Av. Principal 456',
      Telefono: 3109876543,
      Usuario: 'agarcia',
      Contrasena: 'pass456',
      TipoUsuario: 'Administrador',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = new UsuarioService(TestBed.inject(HttpClient));
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ── CU-07: Consultar usuarios ───────────────────────────────────────────────
  describe('CU-07 — getUsuarios: Consultar listado de usuarios', () => {
    it('[camino feliz] debería retornar el listado completo de usuarios', (done) => {
      service.getUsuarios().subscribe((usuarios) => {
        expect(usuarios.length).toBe(2);
        expect(usuarios).toEqual(listaUsuariosMock);
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/`);
      expect(req.request.method).toBe('GET');
      req.flush(listaUsuariosMock);
    });

    it('[borde] debería retornar un arreglo vacío si no hay usuarios registrados', (done) => {
      service.getUsuarios().subscribe((usuarios) => {
        expect(usuarios).toEqual([]);
        done();
      });

      httpMock.expectOne(`${apiBase}/`).flush([]);
    });

    it('[error] debería propagar el error HTTP 500', (done) => {
      service.getUsuarios().subscribe({
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/`).flush(
        { message: 'Error interno' },
        { status: 500, statusText: 'Server Error' }
      );
    });
  });

  // ── CU-04: Registrar usuario ────────────────────────────────────────────────
  describe('CU-04 — crearUsuario: Registrar un nuevo usuario', () => {
    it('[camino feliz] debería enviar el usuario al endpoint POST /add', (done) => {
      const nuevoUsuario: Usuario = { ...usuarioMock, IdUsuario: 0 };

      service.crearUsuario(nuevoUsuario).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevoUsuario);
      req.flush(null);
    });

    it('[error] debería propagar el error si el usuario ya existe (409 Conflict)', (done) => {
      service.crearUsuario(usuarioMock).subscribe({
        error: (err) => {
          expect(err.status).toBe(409);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/add`).flush(
        { message: 'El usuario ya existe' },
        { status: 409, statusText: 'Conflict' }
      );
    });
  });

  // ── CU-05: Editar usuario ───────────────────────────────────────────────────
  describe('CU-05 — editarUsuario: Actualizar información de un usuario', () => {
    it('[camino feliz] debería enviar los datos actualizados al endpoint PUT /:id', (done) => {
      const usuarioActualizado: Usuario = { ...usuarioMock, Nombre: 'Ricardo Actualizado' };

      service.editarUsuario(1, usuarioActualizado).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(usuarioActualizado);
      req.flush(null);
    });

    it('[error] debería propagar el error si el usuario no existe (404)', (done) => {
      service.editarUsuario(999, usuarioMock).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/999`).flush(
        { message: 'Usuario no encontrado' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  // ── CU-06: Eliminar usuario ─────────────────────────────────────────────────
  describe('CU-06 — eliminarUsuario: Eliminar un usuario', () => {
    it('[camino feliz] debería enviar la solicitud DELETE al endpoint correcto', (done) => {
      service.eliminarUsuario(1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('[error] debería propagar el error si el usuario no existe (404)', (done) => {
      service.eliminarUsuario(999).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/999`).flush(
        { message: 'Usuario no encontrado' },
        { status: 404, statusText: 'Not Found' }
      );
    });

    it('[borde] debería construir la URL correctamente con el ID proporcionado', () => {
      service.eliminarUsuario(42).subscribe();
      const req = httpMock.expectOne(`${apiBase}/42`);
      expect(req.request.url).toContain('/42');
      req.flush(null);
    });
  });
});
