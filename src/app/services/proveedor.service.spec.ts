// src/app/services/proveedor.service.spec.ts
// Módulo: Proveedores
// Casos cubiertos: CU-12 (Crear), CU-13 (Editar), CU-14 (Eliminar), CU-15 (Consultar)

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ProveedorService } from './proveedor.service';
import { Proveedor } from '../models/proveedor';
import { environment } from '../../environments/environment';

describe('ProveedorService — Módulo de Proveedores', () => {
  let service: ProveedorService;
  let httpMock: HttpTestingController;
  const apiBase = environment.urlApiBase + 'proveedor';

  // ── Datos de prueba ─────────────────────────────────────────────────────────
  const proveedorMock: Proveedor = {
    IdProveedor: 1,
    Nombre: 'TechSecurity S.A.S',
    Direccion: 'Zona Industrial Calle 80',
    Telefono: 6017654321,
  };

  const listaProveedoresMock: Proveedor[] = [
    proveedorMock,
    { IdProveedor: 2, Nombre: 'SecureTech Ltda', Direccion: 'Av. El Dorado 92', Telefono: 6013456789 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = new ProveedorService(TestBed.inject(HttpClient));
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ── CU-15: Consultar proveedores ────────────────────────────────────────────
  describe('CU-15 — getProveedores: Consultar listado de proveedores', () => {
    it('[camino feliz] debería retornar el listado completo de proveedores', (done) => {
      service.getProveedores().subscribe((proveedores) => {
        expect(proveedores.length).toBe(2);
        expect(proveedores).toEqual(listaProveedoresMock);
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/`);
      expect(req.request.method).toBe('GET');
      req.flush(listaProveedoresMock);
    });

    it('[borde] debería retornar un arreglo vacío si no hay proveedores', (done) => {
      service.getProveedores().subscribe((proveedores) => {
        expect(proveedores).toEqual([]);
        done();
      });

      httpMock.expectOne(`${apiBase}/`).flush([]);
    });

    it('[error] debería propagar el error HTTP 500', (done) => {
      service.getProveedores().subscribe({
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

  // ── CU-12: Crear proveedor ──────────────────────────────────────────────────
  describe('CU-12 — crearProveedor: Registrar un nuevo proveedor', () => {
    it('[camino feliz] debería enviar el proveedor al endpoint POST /add', (done) => {
      const nuevoProveedor: Proveedor = { IdProveedor: 0, Nombre: 'Nuevo Proveedor', Direccion: 'Calle 1', Telefono: 3001111111 };

      service.crearProveedor(nuevoProveedor).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevoProveedor);
      req.flush(null);
    });

    it('[error] debería propagar el error si el proveedor ya existe (409)', (done) => {
      service.crearProveedor(proveedorMock).subscribe({
        error: (err) => {
          expect(err.status).toBe(409);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/add`).flush(
        { message: 'Proveedor duplicado' },
        { status: 409, statusText: 'Conflict' }
      );
    });
  });

  // ── CU-13: Editar proveedor ─────────────────────────────────────────────────
  describe('CU-13 — editarProveedor: Actualizar un proveedor existente', () => {
    it('[camino feliz] debería enviar los datos actualizados al endpoint PUT /:id', (done) => {
      const proveedorActualizado: Proveedor = { ...proveedorMock, Nombre: 'TechSecurity Actualizado' };

      service.editarProveedor(1, proveedorActualizado).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(proveedorActualizado);
      req.flush(null);
    });

    it('[error] debería propagar el error si el proveedor no existe (404)', (done) => {
      service.editarProveedor(999, proveedorMock).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/999`).flush(
        { message: 'Proveedor no encontrado' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  // ── CU-14: Eliminar proveedor ───────────────────────────────────────────────
  describe('CU-14 — eliminarProveedor: Eliminar un proveedor', () => {
    it('[camino feliz] debería enviar la solicitud DELETE al endpoint correcto', (done) => {
      service.eliminarProveedor(1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('[error] debería propagar el error si el proveedor no existe (404)', (done) => {
      service.eliminarProveedor(999).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/999`).flush(
        { message: 'Proveedor no encontrado' },
        { status: 404, statusText: 'Not Found' }
      );
    });

    it('[borde] debería construir la URL con el ID correcto', () => {
      service.eliminarProveedor(7).subscribe();
      const req = httpMock.expectOne(`${apiBase}/7`);
      expect(req.request.url).toContain('/7');
      req.flush(null);
    });
  });
});
