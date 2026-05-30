// src/app/services/carrito.service.spec.ts
// Módulo: Carrito + Sistema
// Casos cubiertos:
//   CU-22 (Agregar producto), CU-23 (Incrementar cantidad / stock),
//   CU-24 (Disminuir cantidad), CU-25 (Eliminar producto),
//   CU-26 (Consultar carrito), CU-27 (Calcular total),
//   CU-28 (Vaciar carrito), CU-34 (Persistencia en localStorage)

import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito.service';
import { Producto } from '../models/producto';

describe('CarritoService — Módulo de Carrito', () => {
  let service: CarritoService;

  // ── Datos de prueba ─────────────────────────────────────────────────────────
  const productoA: Producto = {
    IdProducto: 101,
    Nombre: 'Cámara IP 4K',
    Precio: 350000,
    Stock: 5,
    IdCategoria: 1,
    IdProveedor: 2,
    Imagen: 'camara.jpg',
    Descripcion: 'Cámara exterior 4K',
  };

  const productoB: Producto = {
    IdProducto: 202,
    Nombre: 'Alarma Perimetral',
    Precio: 180000,
    Stock: 3,
    IdCategoria: 2,
    IdProveedor: 1,
    Imagen: 'alarma.jpg',
    Descripcion: 'Alarma con sensor 120°',
  };

  const productoSinStock: Producto = {
    IdProducto: 303,
    Nombre: 'DVR Agotado',
    Precio: 500000,
    Stock: 0,
    IdCategoria: 1,
    IdProveedor: 2,
    Imagen: 'dvr.jpg',
    Descripcion: 'DVR sin stock',
  };

  // Limpiamos localStorage y recreamos el servicio antes de cada test
  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [CarritoService],
    });

    service = TestBed.inject(CarritoService);
  });

  // ── Inicialización ──────────────────────────────────────────────────────────
  describe('Inicialización del servicio', () => {
    it('debería crearse correctamente', () => {
      expect(service).toBeTruthy();
    });

    it('debería iniciar con el carrito vacío si no hay datos en localStorage', () => {
      expect(service.obtenerLista).toEqual([]);
    });
  });

  // ── CU-34: Persistencia en localStorage ────────────────────────────────────
  describe('CU-34 — Persistencia: Conservar y recuperar el carrito en localStorage', () => {
    it('[camino feliz] debería inicializar el carrito vacío si localStorage está limpio', () => {
      expect(service.obtenerLista).toEqual([]);
    });

    it('[camino feliz] debería cargar los productos persistidos al instanciar el servicio', () => {
      const elementosPreexistentes = [{ Producto: productoA, Cantidad: 2 }];
      localStorage.setItem('securityEZ_cart', JSON.stringify(elementosPreexistentes));

      // Reinstanciamos el servicio para simular recarga de página
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [CarritoService] });
      const servicioRecargado = TestBed.inject(CarritoService);

      expect(servicioRecargado.obtenerLista).toEqual(elementosPreexistentes);
    });

    it('[camino feliz] debería actualizar localStorage automáticamente al agregar un producto', () => {
      service.AgregarAlCarrito(productoA);

      const dataGuardada = JSON.parse(localStorage.getItem('securityEZ_cart') || '[]');
      expect(dataGuardada.length).toBe(1);
      expect(dataGuardada[0].Producto.IdProducto).toBe(101);
      expect(dataGuardada[0].Cantidad).toBe(1);
    });

    it('[camino feliz] debería actualizar localStorage al vaciar el carrito', () => {
      service.AgregarAlCarrito(productoA);
      service.LimpiarCarrito();

      const dataGuardada = JSON.parse(localStorage.getItem('securityEZ_cart') || '[]');
      expect(dataGuardada).toEqual([]);
    });

    it('[borde] debería manejar un JSON corrupto en localStorage sin lanzar excepción', () => {
      localStorage.setItem('securityEZ_cart', 'JSON_INVALIDO_{{{');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [CarritoService] });
      const servicioConDatoCorrupto = TestBed.inject(CarritoService);

      expect(servicioConDatoCorrupto.obtenerLista).toEqual([]);
    });
  });

  // ── CU-22: Agregar producto al carrito ─────────────────────────────────────
  describe('CU-22 — AgregarAlCarrito: Agregar un producto', () => {
    it('[camino feliz] debería agregar un producto nuevo con cantidad 1', () => {
      const resultado = service.AgregarAlCarrito(productoA);

      expect(resultado).toBe(true);
      expect(service.obtenerLista.length).toBe(1);
      expect(service.obtenerLista[0].Producto.IdProducto).toBe(101);
      expect(service.obtenerLista[0].Cantidad).toBe(1);
    });

    it('[camino feliz] debería agregar múltiples productos distintos', () => {
      service.AgregarAlCarrito(productoA);
      service.AgregarAlCarrito(productoB);

      expect(service.obtenerLista.length).toBe(2);
    });

    it('[error] debería retornar false y no agregar un producto sin stock', () => {
      const resultado = service.AgregarAlCarrito(productoSinStock);

      expect(resultado).toBe(false);
      expect(service.obtenerLista.length).toBe(0);
    });
  });

  // ── CU-23: Incrementar cantidad respetando stock ────────────────────────────
  describe('CU-23 — AgregarAlCarrito (incremento): Incrementar cantidad respetando stock', () => {
    it('[camino feliz] debería incrementar la cantidad al agregar el mismo producto dos veces', () => {
      service.AgregarAlCarrito(productoA);
      const resultado = service.AgregarAlCarrito(productoA);

      expect(resultado).toBe(true);
      expect(service.obtenerLista[0].Cantidad).toBe(2);
    });

    it('[borde] debería retornar false al intentar superar el stock máximo disponible', () => {
      // productoA tiene Stock: 5, agregamos 5 veces (máximo permitido)
      for (let i = 0; i < 5; i++) {
        service.AgregarAlCarrito(productoA);
      }
      expect(service.obtenerLista[0].Cantidad).toBe(5);

      // El sexto intento debe fallar
      const resultado = service.AgregarAlCarrito(productoA);
      expect(resultado).toBe(false);
      expect(service.obtenerLista[0].Cantidad).toBe(5); // No debe cambiar
    });

    it('[borde] debería respetar el stock exacto (Stock = 1)', () => {
      const productoStockUno: Producto = { ...productoA, Stock: 1 };

      service.AgregarAlCarrito(productoStockUno);
      expect(service.obtenerLista[0].Cantidad).toBe(1);

      const resultado = service.AgregarAlCarrito(productoStockUno);
      expect(resultado).toBe(false);
    });
  });

  // ── CU-24: Disminuir cantidad ───────────────────────────────────────────────
  describe('CU-24 — DecrementarCantidad: Disminuir cantidad de un producto', () => {
    it('[camino feliz] debería reducir la cantidad en 1', () => {
      service.AgregarAlCarrito(productoA);
      service.AgregarAlCarrito(productoA); // Cantidad = 2

      service.DecrementarCantidad(101);

      expect(service.obtenerLista[0].Cantidad).toBe(1);
    });

    it('[borde] debería eliminar el producto del carrito cuando la cantidad llega a 0', () => {
      service.AgregarAlCarrito(productoA); // Cantidad = 1

      service.DecrementarCantidad(101); // Cantidad = 0 → debe eliminarse

      expect(service.obtenerLista.length).toBe(0);
    });

    it('[borde] debería no hacer nada si el producto no existe en el carrito', () => {
      service.AgregarAlCarrito(productoA);

      service.DecrementarCantidad(999); // ID inexistente

      expect(service.obtenerLista.length).toBe(1);
      expect(service.obtenerLista[0].Cantidad).toBe(1);
    });
  });

  // ── CU-25: Eliminar producto del carrito ────────────────────────────────────
  describe('CU-25 — EliminarProducto: Remover un producto completamente del carrito', () => {
    it('[camino feliz] debería eliminar el producto indicado del carrito', () => {
      service.AgregarAlCarrito(productoA);
      service.AgregarAlCarrito(productoB);

      service.EliminarProducto(101);

      expect(service.obtenerLista.length).toBe(1);
      expect(service.obtenerLista[0].Producto.IdProducto).toBe(202);
    });

    it('[camino feliz] debería dejar el carrito vacío si solo había un producto', () => {
      service.AgregarAlCarrito(productoA);

      service.EliminarProducto(101);

      expect(service.obtenerLista.length).toBe(0);
    });

    it('[borde] debería no modificar el carrito si el ID no existe', () => {
      service.AgregarAlCarrito(productoA);

      service.EliminarProducto(999);

      expect(service.obtenerLista.length).toBe(1);
    });
  });

  // ── CU-26: Consultar carrito ────────────────────────────────────────────────
  describe('CU-26 — obtenerLista / carrito$: Consultar el estado del carrito', () => {
    it('[camino feliz] debería retornar el listado actualizado de productos en el carrito', () => {
      service.AgregarAlCarrito(productoA);
      service.AgregarAlCarrito(productoB);

      const lista = service.obtenerLista;

      expect(lista.length).toBe(2);
      expect(lista.map(i => i.Producto.IdProducto)).toContain(101);
      expect(lista.map(i => i.Producto.IdProducto)).toContain(202);
    });

    it('[camino feliz] el observable carrito$ debería emitir el estado actualizado', (done) => {
      service.carrito$.subscribe((lista) => {
        if (lista.length === 1) {
          expect(lista[0].Producto.IdProducto).toBe(101);
          done();
        }
      });

      service.AgregarAlCarrito(productoA);
    });

    it('[borde] debería retornar un arreglo vacío si el carrito está vacío', () => {
      expect(service.obtenerLista).toEqual([]);
    });
  });

  // ── CU-27: Calcular total de compra ─────────────────────────────────────────
  describe('CU-27 — ObtenerTotal: Calcular el total de la compra', () => {
    it('[camino feliz] debería calcular correctamente la sumatoria de precio × cantidad', () => {
      service.AgregarAlCarrito(productoA); // 350.000 × 1
      service.AgregarAlCarrito(productoA); // 350.000 × 2
      service.AgregarAlCarrito(productoB); // 180.000 × 1

      // Total esperado: (350.000 × 2) + (180.000 × 1) = 880.000
      expect(service.ObtenerTotal()).toBe(880000);
    });

    it('[borde] debería retornar 0 si el carrito está vacío', () => {
      expect(service.ObtenerTotal()).toBe(0);
    });

    it('[borde] debería calcular correctamente con un solo producto de cantidad 1', () => {
      service.AgregarAlCarrito(productoB); // 180.000 × 1

      expect(service.ObtenerTotal()).toBe(180000);
    });

    it('[borde] debería calcular el total de unidades correctamente', () => {
      service.AgregarAlCarrito(productoA);
      service.AgregarAlCarrito(productoA);
      service.AgregarAlCarrito(productoB);

      expect(service.ObtenerTotalUnidades()).toBe(3);
    });
  });

  // ── CU-28: Vaciar carrito ───────────────────────────────────────────────────
  describe('CU-28 — LimpiarCarrito: Vaciar todos los elementos del carrito', () => {
    it('[camino feliz] debería remover todos los productos del carrito', () => {
      service.AgregarAlCarrito(productoA);
      service.AgregarAlCarrito(productoB);

      service.LimpiarCarrito();

      expect(service.obtenerLista.length).toBe(0);
      expect(service.ObtenerTotal()).toBe(0);
    });

    it('[camino feliz] debería limpiar también el localStorage', () => {
      service.AgregarAlCarrito(productoA);
      service.LimpiarCarrito();

      const dataGuardada = JSON.parse(localStorage.getItem('securityEZ_cart') || '[]');
      expect(dataGuardada).toEqual([]);
    });

    it('[borde] debería ejecutarse sin errores si el carrito ya está vacío', () => {
      expect(() => service.LimpiarCarrito()).not.toThrow();
      expect(service.obtenerLista).toEqual([]);
    });

    it('[camino feliz] el observable carrito$ debería emitir un arreglo vacío tras limpiar', (done) => {
      service.AgregarAlCarrito(productoA);

      service.carrito$.subscribe((lista) => {
        if (lista.length === 0) {
          expect(lista).toEqual([]);
          done();
        }
      });

      service.LimpiarCarrito();
    });
  });
});
