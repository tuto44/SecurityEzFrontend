// src/app/services/categoria.service.spec.ts
// Módulo: Categorías
// Casos cubiertos: CU-08 (Crear), CU-09 (Editar), CU-10 (Eliminar), CU-11 (Consultar)

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../models/categoria';
import { environment } from '../../environments/environment';

describe('CategoriaService — Módulo de Categorías', () => {
  let service: CategoriaService;
  let httpMock: HttpTestingController;
  const apiBase = environment.urlApiBase + 'categoria';

  // ── Datos de prueba ─────────────────────────────────────────────────────────
  const categoriaMock: Categoria = {
    IdCategoria: 1,
    Nombre: 'Cámaras de Seguridad',
    Imagen: 'camaras.png',
  };

  const listaCategoriasMock: Categoria[] = [
    categoriaMock,
    { IdCategoria: 2, Nombre: 'Alarmas', Imagen: 'alarmas.png' },
    { IdCategoria: 3, Nombre: 'Control de Acceso', Imagen: 'acceso.png' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    // Instanciamos el servicio directamente con HttpClient para evitar problemas de DI
    service = new CategoriaService(TestBed.inject(HttpClient));
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ── CU-11: Consultar categorías ─────────────────────────────────────────────
  describe('CU-11 — getCategorias: Consultar listado de categorías', () => {
    it('[camino feliz] debería retornar el listado completo de categorías', (done) => {
      service.getCategorias().subscribe((categorias) => {
        expect(categorias.length).toBe(3);
        expect(categorias).toEqual(listaCategoriasMock);
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/`);
      expect(req.request.method).toBe('GET');
      req.flush(listaCategoriasMock);
    });

    it('[borde] debería retornar un arreglo vacío si no hay categorías', (done) => {
      service.getCategorias().subscribe((categorias) => {
        expect(categorias).toEqual([]);
        done();
      });

      httpMock.expectOne(`${apiBase}/`).flush([]);
    });

    it('[error] debería propagar el error HTTP 500', (done) => {
      service.getCategorias().subscribe({
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

  // ── CU-08: Crear categoría ──────────────────────────────────────────────────
  describe('CU-08 — crearCategoria: Registrar una nueva categoría', () => {
    it('[camino feliz] debería enviar la categoría al endpoint POST /add', (done) => {
      const nuevaCategoria: Categoria = { IdCategoria: 0, Nombre: 'DVR/NVR', Imagen: 'dvr.png' };

      service.crearCategoria(nuevaCategoria).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevaCategoria);
      req.flush(null);
    });

    it('[error] debería propagar el error si la categoría ya existe (409)', (done) => {
      service.crearCategoria(categoriaMock).subscribe({
        error: (err) => {
          expect(err.status).toBe(409);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/add`).flush(
        { message: 'Categoría duplicada' },
        { status: 409, statusText: 'Conflict' }
      );
    });
  });

  // ── CU-09: Editar categoría ─────────────────────────────────────────────────
  describe('CU-09 — editarCategoria: Actualizar una categoría existente', () => {
    it('[camino feliz] debería enviar los datos actualizados al endpoint PUT /:id', (done) => {
      const categoriaActualizada: Categoria = { ...categoriaMock, Nombre: 'Cámaras IP' };

      service.editarCategoria(1, categoriaActualizada).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(categoriaActualizada);
      req.flush(null);
    });

    it('[error] debería propagar el error si la categoría no existe (404)', (done) => {
      service.editarCategoria(999, categoriaMock).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/999`).flush(
        { message: 'Categoría no encontrada' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  // ── CU-10: Eliminar categoría ───────────────────────────────────────────────
  describe('CU-10 — eliminarCategoria: Eliminar una categoría', () => {
    it('[camino feliz] debería enviar la solicitud DELETE al endpoint correcto', (done) => {
      service.eliminarCategoria(1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('[error] debería propagar el error si la categoría no existe (404)', (done) => {
      service.eliminarCategoria(999).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/999`).flush(
        { message: 'Categoría no encontrada' },
        { status: 404, statusText: 'Not Found' }
      );
    });

    it('[borde] debería construir la URL con el ID correcto', () => {
      service.eliminarCategoria(5).subscribe();
      const req = httpMock.expectOne(`${apiBase}/5`);
      expect(req.request.url).toContain('/5');
      req.flush(null);
    });
  });
});
