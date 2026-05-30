// src/app/services/producto.service.spec.ts
// Módulo: Productos
// Casos cubiertos: CU-16 (Crear), CU-17 (Editar), CU-18 (Eliminar),
//                  CU-19 (Consultar), CU-20 (Detalle), CU-21 (Stock disponible)

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ProductoService } from './producto.service';
import { Producto } from '../models/producto';
import { environment } from '../../environments/environment';

describe('ProductoService — Módulo de Productos', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;
  const apiBase = environment.urlApiBase + 'producto';

  // ── Datos de prueba ─────────────────────────────────────────────────────────
  const productoMock: Producto = {
    IdProducto: 1,
    IdProveedor: 2,
    IdCategoria: 1,
    Nombre: 'Cámara IP 4K Exterior',
    Precio: 350000,
    Stock: 15,
    Imagen: 'camara-4k.jpg',
    Descripcion: 'Cámara de vigilancia exterior con resolución 4K y visión nocturna.',
  };

  const listaProductosMock: Producto[] = [
    productoMock,
    {
      IdProducto: 2,
      IdProveedor: 1,
      IdCategoria: 2,
      Nombre: 'Alarma Perimetral',
      Precio: 180000,
      Stock: 8,
      Imagen: 'alarma.jpg',
      Descripcion: 'Alarma con sensor de movimiento de 120°.',
    },
    {
      IdProducto: 3,
      IdProveedor: 2,
      IdCategoria: 1,
      Nombre: 'DVR 8 Canales',
      Precio: 520000,
      Stock: 0, // Sin stock
      Imagen: 'dvr.jpg',
      Descripcion: 'Grabador digital de 8 canales con disco duro de 1TB.',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = new ProductoService(TestBed.inject(HttpClient));
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ── CU-19: Consultar productos ──────────────────────────────────────────────
  describe('CU-19 — getProductos: Consultar listado de productos', () => {
    it('[camino feliz] debería retornar el listado completo de productos', (done) => {
      service.getProductos().subscribe((productos) => {
        expect(productos.length).toBe(3);
        expect(productos).toEqual(listaProductosMock);
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/`);
      expect(req.request.method).toBe('GET');
      req.flush(listaProductosMock);
    });

    it('[borde] debería retornar un arreglo vacío si no hay productos', (done) => {
      service.getProductos().subscribe((productos) => {
        expect(productos).toEqual([]);
        done();
      });

      httpMock.expectOne(`${apiBase}/`).flush([]);
    });

    it('[error] debería propagar el error HTTP 500', (done) => {
      service.getProductos().subscribe({
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

  // ── CU-20: Visualizar detalle de producto ───────────────────────────────────
  describe('CU-20 — getProductos (detalle): Visualizar información completa de un producto', () => {
    it('[camino feliz] debería retornar todos los campos del producto incluyendo descripción e imagen', (done) => {
      service.getProductos().subscribe((productos) => {
        const detalle = productos.find(p => p.IdProducto === 1);
        expect(detalle).toBeDefined();
        expect(detalle?.Nombre).toBe('Cámara IP 4K Exterior');
        expect(detalle?.Descripcion).toBeTruthy();
        expect(detalle?.Imagen).toBeTruthy();
        expect(detalle?.Precio).toBeGreaterThan(0);
        expect(detalle?.IdCategoria).toBeDefined();
        expect(detalle?.IdProveedor).toBeDefined();
        done();
      });

      httpMock.expectOne(`${apiBase}/`).flush(listaProductosMock);
    });
  });

  // ── CU-21: Consultar stock disponible ──────────────────────────────────────
  describe('CU-21 — Stock: Consultar existencias disponibles', () => {
    it('[camino feliz] debería mostrar el stock correcto para un producto con existencias', (done) => {
      service.getProductos().subscribe((productos) => {
        const producto = productos.find(p => p.IdProducto === 1);
        expect(producto?.Stock).toBe(15);
        expect(producto?.Stock).toBeGreaterThan(0);
        done();
      });

      httpMock.expectOne(`${apiBase}/`).flush(listaProductosMock);
    });

    it('[borde] debería identificar correctamente un producto sin stock (Stock = 0)', (done) => {
      service.getProductos().subscribe((productos) => {
        const sinStock = productos.find(p => p.IdProducto === 3);
        expect(sinStock?.Stock).toBe(0);
        done();
      });

      httpMock.expectOne(`${apiBase}/`).flush(listaProductosMock);
    });

    it('[borde] debería poder filtrar productos con stock disponible', (done) => {
      service.getProductos().subscribe((productos) => {
        const conStock = productos.filter(p => p.Stock > 0);
        expect(conStock.length).toBe(2);
        done();
      });

      httpMock.expectOne(`${apiBase}/`).flush(listaProductosMock);
    });
  });

  // ── CU-16: Crear producto ───────────────────────────────────────────────────
  describe('CU-16 — crearProducto: Registrar un nuevo producto vinculando categoría y proveedor', () => {
    it('[camino feliz] debería enviar el producto con IdCategoria e IdProveedor al endpoint POST /add', (done) => {
      const nuevoProducto: Producto = {
        IdProducto: 0,
        IdProveedor: 2,
        IdCategoria: 1,
        Nombre: 'NVR 16 Canales',
        Precio: 750000,
        Stock: 5,
        Imagen: 'nvr.jpg',
        Descripcion: 'Grabador de red de 16 canales.',
      };

      service.crearProducto(nuevoProducto).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.IdCategoria).toBe(1);
      expect(req.request.body.IdProveedor).toBe(2);
      expect(req.request.body).toEqual(nuevoProducto);
      req.flush(null);
    });

    it('[error] debería propagar el error si la categoría o proveedor no existen (400)', (done) => {
      const productoInvalido: Producto = { ...productoMock, IdCategoria: 999, IdProveedor: 999 };

      service.crearProducto(productoInvalido).subscribe({
        error: (err) => {
          expect(err.status).toBe(400);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/add`).flush(
        { message: 'Categoría o proveedor no válidos' },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });

  // ── CU-17: Editar producto ──────────────────────────────────────────────────
  describe('CU-17 — editarProducto: Actualizar un producto existente', () => {
    it('[camino feliz] debería enviar los datos actualizados al endpoint PUT /:id', (done) => {
      const productoActualizado: Producto = { ...productoMock, Precio: 400000, Stock: 20 };

      service.editarProducto(1, productoActualizado).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(productoActualizado);
      req.flush(null);
    });

    it('[error] debería propagar el error si el producto no existe (404)', (done) => {
      service.editarProducto(999, productoMock).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/999`).flush(
        { message: 'Producto no encontrado' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  // ── CU-18: Eliminar producto ────────────────────────────────────────────────
  describe('CU-18 — eliminarProducto: Eliminar un producto', () => {
    it('[camino feliz] debería enviar la solicitud DELETE al endpoint correcto', (done) => {
      service.eliminarProducto(1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBase}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('[error] debería propagar el error si el producto no existe (404)', (done) => {
      service.eliminarProducto(999).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        },
      });

      httpMock.expectOne(`${apiBase}/999`).flush(
        { message: 'Producto no encontrado' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });
});
