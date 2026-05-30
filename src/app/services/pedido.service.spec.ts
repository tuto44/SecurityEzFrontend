// src/app/services/pedido.service.spec.ts
// Módulo: Pedidos
// Casos cubiertos: CU-29 (Crear pedido), CU-30 (Consultar pedidos),
//                  CU-31 (Editar pedido), CU-32 (Eliminar pedido),
//                  CU-33 (Consultar detalle de pedido)

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { PedidoService } from './pedido.service';
import { DescripcionPedidoService } from './descripcion-pedido.service';
import { Pedido } from '../models/pedido';
import { DescripcionPedido } from '../models/descripcionPedido';
import { environment } from '../../environments/environment';

describe('PedidoService — Módulo de Pedidos', () => {
  let pedidoService: PedidoService;
  let descripcionService: DescripcionPedidoService;
  let httpMock: HttpTestingController;

  const apiBasePedido      = environment.urlApiBase + 'pedido';
  const apiBaseDescripcion = environment.urlApiBase + 'descripcionpedido';

  // ── Datos de prueba ─────────────────────────────────────────────────────────
  const pedidoMock: Pedido = {
    IdPedido: 1,
    IdUsuario: 10,
    Fecha: new Date('2026-05-29'),
    Total: 530000,
  };

  const listaPedidosMock: Pedido[] = [
    pedidoMock,
    { IdPedido: 2, IdUsuario: 5, Fecha: new Date('2026-05-28'), Total: 180000 },
    { IdPedido: 3, IdUsuario: 10, Fecha: new Date('2026-05-27'), Total: 700000 },
  ];

  const detallesPedidoMock: DescripcionPedido[] = [
    { IdDescripcionPedido: 1, IdPedido: 1, IdProducto: 101, Cantidad: 1, Precio: 350000, MontoTotal: 350000 },
    { IdDescripcionPedido: 2, IdPedido: 1, IdProducto: 202, Cantidad: 1, Precio: 180000, MontoTotal: 180000 },
  ];

  const pedidoCompletoDTO = {
    IdUsuario: 10,
    Total: 530000,
    Detalles: [
      { IdProducto: 101, Cantidad: 1, Precio: 350000, MontoTotal: 350000 },
      { IdProducto: 202, Cantidad: 1, Precio: 180000, MontoTotal: 180000 },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    const http = TestBed.inject(HttpClient);
    pedidoService      = new PedidoService(http);
    descripcionService = new DescripcionPedidoService(http);
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(pedidoService).toBeTruthy();
    expect(descripcionService).toBeTruthy();
  });

  // ── CU-30: Consultar pedidos ────────────────────────────────────────────────
  describe('CU-30 — getPedidos: Consultar listado de pedidos', () => {
    it('[camino feliz] debería retornar el listado completo de pedidos', (done) => {
      pedidoService.getPedidos().subscribe((pedidos) => {
        expect(pedidos.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne(`${apiBasePedido}/`);
      expect(req.request.method).toBe('GET');
      req.flush(listaPedidosMock);
    });

    it('[borde] debería retornar un arreglo vacío si no hay pedidos', (done) => {
      pedidoService.getPedidos().subscribe((pedidos) => {
        expect(pedidos).toEqual([]);
        done();
      });

      httpMock.expectOne(`${apiBasePedido}/`).flush([]);
    });

    it('[error] debería propagar el error HTTP 500', (done) => {
      pedidoService.getPedidos().subscribe({
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        },
      });

      httpMock.expectOne(`${apiBasePedido}/`).flush(
        { message: 'Error interno' },
        { status: 500, statusText: 'Server Error' }
      );
    });
  });

  // ── CU-29: Crear pedido ─────────────────────────────────────────────────────
  describe('CU-29 — crearPedido / registrarPedidoCompleto: Generar un nuevo pedido', () => {
    it('[camino feliz] debería enviar el pedido simple al endpoint POST /add', (done) => {
      pedidoService.crearPedido(pedidoMock).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBasePedido}/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(pedidoMock);
      req.flush(null);
    });

    it('[camino feliz] registrarPedidoCompleto debería enviar el DTO completo y retornar el ID del pedido creado', (done) => {
      const respuestaEsperada = { IdPedido: 42, message: 'Pedido registrado exitosamente' };

      pedidoService.registrarPedidoCompleto(pedidoCompletoDTO).subscribe((res) => {
        expect(res.IdPedido).toBe(42);
        expect(res.message).toBeTruthy();
        done();
      });

      const req = httpMock.expectOne(`${apiBasePedido}/registrar-todo`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.IdUsuario).toBe(10);
      expect(req.request.body.Total).toBe(530000);
      expect(req.request.body.Detalles.length).toBe(2);
      req.flush(respuestaEsperada);
    });

    it('[error] debería propagar el error si el pedido falla en el servidor (500)', (done) => {
      pedidoService.registrarPedidoCompleto(pedidoCompletoDTO).subscribe({
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        },
      });

      httpMock.expectOne(`${apiBasePedido}/registrar-todo`).flush(
        { message: 'Error al registrar el pedido' },
        { status: 500, statusText: 'Server Error' }
      );
    });
  });

  // ── CU-31: Editar pedido (cambio de estado) ─────────────────────────────────
  describe('CU-31 — editarPedido: Modificar el estado de un pedido', () => {
    it('[camino feliz] debería enviar el pedido actualizado al endpoint PUT /:id', (done) => {
      const pedidoActualizado: Pedido = { ...pedidoMock, Total: 600000 };

      pedidoService.editarPedido(1, pedidoActualizado).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBasePedido}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(pedidoActualizado);
      req.flush(null);
    });

    it('[error] debería propagar el error si el pedido no existe (404)', (done) => {
      pedidoService.editarPedido(999, pedidoMock).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        },
      });

      httpMock.expectOne(`${apiBasePedido}/999`).flush(
        { message: 'Pedido no encontrado' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  // ── CU-32: Eliminar pedido ──────────────────────────────────────────────────
  describe('CU-32 — eliminarPedido: Cancelar o eliminar un pedido', () => {
    it('[camino feliz] debería enviar la solicitud DELETE al endpoint correcto', (done) => {
      pedidoService.eliminarPedido(1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBasePedido}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('[error] debería propagar el error si el pedido no existe (404)', (done) => {
      pedidoService.eliminarPedido(999).subscribe({
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        },
      });

      httpMock.expectOne(`${apiBasePedido}/999`).flush(
        { message: 'Pedido no encontrado' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  // ── CU-33: Consultar detalle de pedido ──────────────────────────────────────
  describe('CU-33 — DescripcionPedidoService: Consultar detalle de artículos de un pedido', () => {
    it('[camino feliz] debería retornar el listado de descripciones de pedido', (done) => {
      descripcionService.getDescripcionPedidos().subscribe((detalles) => {
        expect(detalles.length).toBe(2);
        expect(detalles).toEqual(detallesPedidoMock);
        done();
      });

      const req = httpMock.expectOne(`${apiBaseDescripcion}/`);
      expect(req.request.method).toBe('GET');
      req.flush(detallesPedidoMock);
    });

    it('[camino feliz] debería poder filtrar los detalles por IdPedido', (done) => {
      descripcionService.getDescripcionPedidos().subscribe((detalles) => {
        const detallesPedido1 = detalles.filter(d => d.IdPedido === 1);
        expect(detallesPedido1.length).toBe(2);
        expect(detallesPedido1[0].MontoTotal).toBe(350000);
        expect(detallesPedido1[1].MontoTotal).toBe(180000);
        done();
      });

      httpMock.expectOne(`${apiBaseDescripcion}/`).flush(detallesPedidoMock);
    });

    it('[camino feliz] debería verificar que MontoTotal = Precio × Cantidad en cada detalle', (done) => {
      descripcionService.getDescripcionPedidos().subscribe((detalles) => {
        detalles.forEach(detalle => {
          expect(detalle.MontoTotal).toBe(detalle.Precio * detalle.Cantidad);
        });
        done();
      });

      httpMock.expectOne(`${apiBaseDescripcion}/`).flush(detallesPedidoMock);
    });

    it('[borde] debería retornar un arreglo vacío si el pedido no tiene detalles', (done) => {
      descripcionService.getDescripcionPedidos().subscribe((detalles) => {
        expect(detalles).toEqual([]);
        done();
      });

      httpMock.expectOne(`${apiBaseDescripcion}/`).flush([]);
    });

    it('[camino feliz] debería crear un detalle de pedido correctamente', (done) => {
      const nuevoDetalle: DescripcionPedido = {
        IdDescripcionPedido: 0,
        IdPedido: 1,
        IdProducto: 303,
        Cantidad: 2,
        Precio: 500000,
        MontoTotal: 1000000,
      };

      descripcionService.crearDescripcionPedido(nuevoDetalle).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiBaseDescripcion}/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevoDetalle);
      req.flush(null);
    });
  });
});
