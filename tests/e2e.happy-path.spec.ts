/**
 * @file e2e.happy-path.spec.ts
 * @description Prueba E2E del flujo completo de negocio — SecurityEz
 *
 * Flujo cubierto (Happy Path integral):
 * CU-01  → Login con credenciales válidas
 * CU-19  → Catálogo: verificar que la lista de productos carga
 * CU-20  → Catálogo: ver detalle de un producto
 * CU-22  → Carrito: agregar producto
 * CU-23  → Carrito: incrementar cantidad respetando stock
 * CU-27  → Carrito: calcular total con precisión matemática
 * CU-34  → Sistema: persistencia del carrito en localStorage tras recarga
 * CU-29  → Pedidos: crear pedido (checkout completo)
 * CU-35  → Sistema: mensaje de confirmación de éxito
 * CU-03  → Auth: verificar que rutas protegidas bloquean el acceso
 *
 * ─── INSTRUCCIONES DE USO ────────────────────────────────────────────────────
 * 1. Levanta el frontend:  npm run start
 * 2. Levanta el backend:   node server.js  (o el comando de tu API)
 * 3. Ejecuta los tests:    npx playwright test tests/e2e.happy-path.spec.ts
 * 4. Ver reporte HTML:     npx playwright show-report
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ─── CREDENCIALES DE PRUEBA ──────────────────────────────────────────────────
 * Ajusta las constantes de la sección CONFIG si tus datos difieren.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect, Page } from '@playwright/test';

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN DE CONFIGURACIÓN — Ajusta estos valores a tu entorno
// ═══════════════════════════════════════════════════════════════════════════════
const CONFIG = {
  // Credenciales de un usuario CLIENTE válido en tu base de datos
  USUARIO_CLIENTE: 'florian',
  PASSWORD_CLIENTE: '123456',

  // Credenciales de un usuario ADMINISTRADOR válido
  USUARIO_ADMIN: 'tuto',
  PASSWORD_ADMIN: '123456',

  // Nombre visible del usuario en el navbar tras el login (campo Nombre del JWT)
  NOMBRE_USUARIO_VISIBLE: 'Lucas Florian',

  // Nombre de un producto que EXISTE en tu catálogo y tiene Stock > 0
  NOMBRE_PRODUCTO: 'Insta 360 x4',

  // Precio unitario del producto anterior (número, sin formato)
  PRECIO_PRODUCTO: 400000,

  // Cantidad a agregar al carrito en el test de incremento (CU-23)
  CANTIDAD_A_AGREGAR: 2,

  // Datos de la tarjeta simulada para el checkout
  TARJETA: {
    titular: 'Ricardo Rendón',
    numero: '4111 1111 1111 1111',
    expiracion: '12/26',
    cvc: '123',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS — Funciones reutilizables para acciones comunes
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Abre el menú offcanvas del navbar (hamburguesa) y espera a que esté visible.
 * Usa el selector CSS porque el botón toggler no tiene aria-label ni texto visible.
 */
async function abrirMenuNavbar(page: Page): Promise<void> {
  await page.locator('button.navbar-toggler').click();
  await expect(page.locator('#offcanvasNavbar')).toBeVisible();
}

/**
 * Cierra el offcanvas del navbar si está abierto, para no bloquear interacciones.
 */
async function cerrarMenuNavbar(page: Page): Promise<void> {
  const closeBtn = page.locator('#offcanvasNavbar .btn-close');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await expect(page.locator('#offcanvasNavbar')).not.toBeVisible({ timeout: 3_000 });
  }
}

/**
 * Intercepta la llamada al endpoint de login y la mockea con un JWT válido.
 * Úsala si quieres aislar el test del backend real.
 *
 * NOTA: Por defecto el test usa el backend real.
 * Para activar el mock, descomenta la llamada a esta función en el test.
 */
async function mockLoginAPI(page: Page): Promise<void> {
  const FAKE_JWT =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJJZFVzdWFyaW8iOjEsIk5vbWJyZSI6IlJpY2FyZG8iLCJUaXBvVXN1YXJpbyI6IkNsaWVudGUiLCJpYXQiOjE3MTY5OTk5OTl9.' +
    'FIRMA_INVALIDA_REEMPLAZAR';

  await page.route('**/api/usuario/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: FAKE_JWT }),
    });
  });
}

/**
 * Intercepta el endpoint de productos y devuelve datos controlados.
 * Úsala para aislar el test del backend real.
 */
async function mockProductosAPI(page: Page): Promise<void> {
  await page.route('**/api/producto/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          IdProducto: 1,
          IdProveedor: 1,
          IdCategoria: 1,
          Nombre: CONFIG.NOMBRE_PRODUCTO,
          Precio: CONFIG.PRECIO_PRODUCTO,
          Stock: 10,
          Imagen: 'https://via.placeholder.com/300x200?text=Camara+IP',
          Descripcion: 'Cámara de vigilancia exterior con resolución 4K y visión nocturna de 30m.',
        },
      ]),
    });
  });
}

/**
 * Intercepta el endpoint de creación de pedido completo.
 */
async function mockRegistrarPedidoAPI(page: Page): Promise<void> {
  await page.route('**/api/pedido/registrar-todo', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ IdPedido: 42, message: 'Pedido registrado exitosamente' }),
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST PRINCIPAL — Happy Path integral
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('SecurityEz — Flujo E2E completo de compra (Happy Path)', () => {

  // Limpiamos localStorage antes de cada test para garantizar estado limpio
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
  });

  // ─────────────────────────────────────────────────────────────────────────────
  test(
    'Flujo completo: Login → Catálogo → Carrito → Checkout',
    async ({ page }) => {

      // =========================================================================
      // ── BLOQUE 1: CU-01 — Iniciar sesión con credenciales válidas ─────────────
      // =========================================================================

      await test.step('CU-01: Navegar al login e iniciar sesión', async () => {
        await page.goto('/login');

        // Verificar que la página de login cargó correctamente
        await expect(page).toHaveTitle(/Proyecto|SecurityEz|Angular/i);
        await expect(page.getByText('SecurityEz')).toBeVisible();
        await expect(page.getByText('Control de Acceso')).toBeVisible();

        // Completar el formulario de login
        await page.getByPlaceholder('Ej. rrendon').fill(CONFIG.USUARIO_CLIENTE);
        await page.getByPlaceholder('••••••••').fill(CONFIG.PASSWORD_CLIENTE);

        // Verificar que el botón de submit está habilitado con datos válidos
        const btnIngresar = page.getByRole('button', { name: /ingresar al sistema/i });
        await expect(btnIngresar).toBeEnabled();

        // Enviar el formulario y esperar la respuesta del backend
        await Promise.all([
          page.waitForResponse(
            (res) => res.url().includes('/api/usuario/login') && res.status() === 200,
            { timeout: 15_000 }
          ),
          btnIngresar.click(),
        ]);

        // Verificar redirección exitosa al home
        await expect(page).toHaveURL(/\/home/);

        // Verificar que el token JWT fue guardado en localStorage
        const token = await page.evaluate(() => localStorage.getItem('securityEZ_token'));
        expect(token).not.toBeNull();
        expect(token?.length).toBeGreaterThan(20);

        // Verificar que el navbar muestra el nombre del usuario logueado
        await abrirMenuNavbar(page);
        await expect(
          page.locator('#offcanvasNavbar .nav-user-info strong')
        ).toContainText(CONFIG.NOMBRE_USUARIO_VISIBLE, { timeout: 5_000 });
        await cerrarMenuNavbar(page);
      });

      // =========================================================================
      // ── BLOQUE 2: CU-19 — Navegar al catálogo y verificar que carga ───────────
      // =========================================================================

      await test.step('CU-19: Navegar al catálogo y verificar que los productos cargan', async () => {
        await page.goto('/store/catalogo');

        // Esperar a que el spinner de carga desaparezca
        await expect(page.locator('.spinner-border')).not.toBeVisible({ timeout: 15_000 });

        // Verificar que el título del catálogo está presente
        await expect(
          page.getByRole('heading', { name: /catálogo de productos/i })
        ).toBeVisible();

        // Verificar que hay al menos una tarjeta de producto visible
        const tarjetasProducto = page.locator('.card.h-100');
        await expect(tarjetasProducto.first()).toBeVisible({ timeout: 10_000 });
        const cantidadProductos = await tarjetasProducto.count();
        expect(cantidadProductos).toBeGreaterThan(0);

        // Verificar que los productos muestran precio y botón de agregar
        await expect(page.locator('.text-success.fw-bold').first()).toBeVisible();
        await expect(
          page.getByRole('button', { name: /añadir al carrito/i }).first()
        ).toBeVisible();
      });

      // =========================================================================
      // ── BLOQUE 3: CU-20 — Ver detalle de un producto ─────────────────────────
      // =========================================================================

      await test.step('CU-20: Abrir el modal de detalle de un producto y validar su información', async () => {
        const tarjetaObjetivo = page
          .locator('.card.h-100')
          .filter({ hasText: CONFIG.NOMBRE_PRODUCTO })
          .first();

        const usarPrimero = !(await tarjetaObjetivo.isVisible());
        const tarjeta = usarPrimero
          ? page.locator('.card.h-100').first()
          : tarjetaObjetivo;

        const nombreProductoEnCard = await tarjeta.locator('.card-title').textContent();
        const precioTexto = await tarjeta.locator('.text-success.fw-bold').textContent();

        await tarjeta.locator('button:has(.bi-eye-fill)').click();

        const modalDetalle = page.locator('#modalDetalleProducto');
        await expect(modalDetalle).toBeVisible({ timeout: 5_000 });

        await expect(
          modalDetalle.getByRole('heading', { level: 4 })
        ).toContainText(nombreProductoEnCard?.trim() ?? '');

        await expect(modalDetalle.locator('.text-success.fw-bold')).toContainText(
          precioTexto?.trim() ?? ''
        );

        await expect(modalDetalle.locator('p.text-muted')).not.toBeEmpty();
        await expect(modalDetalle.locator('.bg-light.p-2')).toBeVisible();

        await modalDetalle.getByRole('button', { name: /cerrar/i }).click();
        await expect(modalDetalle).not.toBeVisible({ timeout: 3_000 });
      });

      // =========================================================================
      // ── BLOQUE 4: CU-22 — Agregar producto al carrito ────────────────────────
      // =========================================================================

      let precioUnitario = 0;

      await test.step('CU-22: Agregar un producto al carrito desde el catálogo', async () => {
        const tarjeta = page
          .locator('.card.h-100')
          .filter({ hasText: CONFIG.NOMBRE_PRODUCTO })
          .first();

        const usarPrimero = !(await tarjeta.isVisible());
        const tarjetaFinal = usarPrimero ? page.locator('.card.h-100').first() : tarjeta;

        const precioTexto = await tarjetaFinal.locator('.text-success.fw-bold').textContent();
        precioUnitario = parseFloat(
          (precioTexto ?? '0').replace(/[^0-9.]/g, '').replace(',', '')
        );

        const btnAgregar = tarjetaFinal.getByRole('button', { name: /añadir al carrito/i });
        await expect(btnAgregar).toBeEnabled();
        await btnAgregar.click();

        await expect(page.getByText(/producto añadido al carrito/i)).toBeVisible({
          timeout: 5_000,
        });

        await expect(page.getByText(/producto añadido al carrito/i)).not.toBeVisible({
          timeout: 5_000,
        });
      });

      // =========================================================================
      // ── BLOQUE 5: CU-23 & CU-27 — Incrementar cantidad y calcular total ───────
      // =========================================================================

      await test.step('CU-23 & CU-27: Navegar al carrito, incrementar cantidad y verificar total', async () => {
        await page.goto('/store/carrito');

        await expect(
          page.getByRole('heading', { name: /tu carrito de compras/i })
        ).toBeVisible();
        await expect(page.locator('table.table')).toBeVisible({ timeout: 5_000 });

        const filaProducto = page.locator('tbody tr').first();
        await expect(filaProducto).toBeVisible();

        const cantidadSpan = filaProducto.locator('.form-control.text-center');
        await expect(cantidadSpan).toHaveText('1');

        const btnMas = filaProducto.getByRole('button', { name: '+' });
        const vecesAIncrementar = CONFIG.CANTIDAD_A_AGREGAR - 1;

        for (let i = 0; i < vecesAIncrementar; i++) {
          await expect(btnMas).toBeEnabled();
          await btnMas.click();
          await page.waitForTimeout(200);
        }

        await expect(cantidadSpan).toHaveText(String(CONFIG.CANTIDAD_A_AGREGAR));

        const subtotalEsperado = precioUnitario * CONFIG.CANTIDAD_A_AGREGAR;

        const subtotalTexto = await filaProducto.locator('td.fw-bold.text-dark').textContent();
        const subtotalMostrado = parseFloat(
          (subtotalTexto ?? '0').replace(/[^0-9.]/g, '').replace(',', '')
        );

        expect(Math.abs(subtotalMostrado - subtotalEsperado)).toBeLessThanOrEqual(1);

        const totalTexto = await page
          .locator('.card-body .fs-3.fw-bold.text-success')
          .textContent();
        const totalMostrado = parseFloat(
          (totalTexto ?? '0').replace(/[^0-9.]/g, '').replace(',', '')
        );

        expect(Math.abs(totalMostrado - subtotalEsperado)).toBeLessThanOrEqual(1);
      });

      // =========================================================================
      // ── BLOQUE 6: CU-34 — Persistencia del carrito en localStorage ───────────
      // =========================================================================

      await test.step('CU-34: Recargar la página y verificar que el carrito persiste en localStorage', async () => {
        const carritoAntesStr = await page.evaluate(() =>
          localStorage.getItem('securityEZ_cart')
        );
        expect(carritoAntesStr).not.toBeNull();

        const carritoAntes = JSON.parse(carritoAntesStr!);
        expect(carritoAntes.length).toBeGreaterThan(0);
        expect(carritoAntes[0].Cantidad).toBe(CONFIG.CANTIDAD_A_AGREGAR);

        await page.reload();

        await expect(
          page.getByRole('heading', { name: /tu carrito de compras/i })
        ).toBeVisible({ timeout: 10_000 });

        const cartDespuesStr = await page.evaluate(() =>
          localStorage.getItem('securityEZ_cart')
        );
        expect(cartDespuesStr).not.toBeNull();

        const cartDespues = JSON.parse(cartDespuesStr!);
        expect(cartDespues.length).toBe(carritoAntes.length);
        expect(cartDespues[0].Cantidad).toBe(CONFIG.CANTIDAD_A_AGREGAR);
        expect(cartDespues[0].Producto.IdProducto).toBe(
          carritoAntes[0].Producto.IdProducto
        );

        await expect(page.locator('tbody tr').first()).toBeVisible();
        const cantidadSpanDespues = page
          .locator('tbody tr')
          .first()
          .locator('.form-control.text-center');
        await expect(cantidadSpanDespues).toHaveText(String(CONFIG.CANTIDAD_A_AGREGAR));
      });

      // =========================================================================
      // ── BLOQUE 7: CU-29 & CU-35 — Checkout: crear pedido y confirmar ─────────
      // =========================================================================

      await test.step('CU-29 & CU-35: Proceder al pago, crear el pedido y verificar confirmación', async () => {
        await page.route('**/api/pedido/registrar-todo', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ IdPedido: 42, message: 'Pedido registrado exitosamente' }),
          });
        });

        const btnProcesar = page.getByRole('button', { name: /proceder al pago/i });
        await expect(btnProcesar).toBeVisible();
        await btnProcesar.click();

        const modalPago = page.locator('#modalPasarelaPago');
        await expect(modalPago).toBeVisible({ timeout: 5_000 });

        const montoEnModal = await modalPago.locator('.text-success.fw-bold').textContent();
        const montoNumerico = parseFloat(
          (montoEnModal ?? '0').replace(/[^0-9.]/g, '').replace(',', '')
        );
        const totalEsperado = precioUnitario * CONFIG.CANTIDAD_A_AGREGAR;
        expect(Math.abs(montoNumerico - totalEsperado)).toBeLessThanOrEqual(1);

        await modalPago.getByPlaceholder(/Ej. Ricardo Rendón/i).fill(CONFIG.TARJETA.titular);
        await modalPago.getByPlaceholder(/0000 0000 0000 0000/i).fill(CONFIG.TARJETA.numero);
        await modalPago.getByPlaceholder(/MM\/AA/i).fill(CONFIG.TARJETA.expiracion);
        await modalPago.getByPlaceholder(/123/i).fill(CONFIG.TARJETA.cvc);

        const pedidoResponsePromise = page.waitForResponse(
          (res) =>
            res.url().includes('/api/pedido/registrar-todo') && res.status() === 200,
          { timeout: 25_000 }
        );

        await modalPago.getByRole('button', { name: /autorizar pago/i }).click();

        await expect(page.locator('.swal2-popup')).toBeVisible({ timeout: 5_000 });

        await pedidoResponsePromise;

        // ── CU-35: Verificar el mensaje de confirmación de éxito ─────────────
        await expect(page.locator('.swal2-popup')).toBeVisible({ timeout: 10_000 });
        await expect(
          page.locator('.swal2-title')
        ).toContainText(/compra finalizada con éxito/i, { timeout: 10_000 });

        const cartPostPedido = await page.evaluate(() =>
          localStorage.getItem('securityEZ_cart')
        );
        const cartArray = JSON.parse(cartPostPedido ?? '[]');
        expect(cartArray.length).toBe(0);

        const navPromise = page.waitForURL(/\/home/, { timeout: 10_000 });
        await page.locator('.swal2-cancel').click();
        await navPromise;

        await expect(page.locator('.swal2-popup')).not.toBeVisible({ timeout: 5_000 });
        await expect(page.locator('button.navbar-toggler')).toBeVisible({ timeout: 5_000 });
      });

      // =========================================================================
      // ── BLOQUE 8: CU-03 — Verificar que rutas protegidas bloquean el acceso ──
      // =========================================================================

      await test.step('CU-03: Verificar que las rutas protegidas redirigen si no se tienen permisos', async () => {
        // Intentar acceder directamente a una ruta protegida por AdminGuard 
        // (Nota: como no se ha hecho logout manual, esto prueba el comportamiento con el rol actual si aplica, o denegación si requiere re-autenticación)
        await page.goto('/usuario');
        await expect(page).toHaveURL(/\/home/, { timeout: 5_000 });

        await page.goto('/producto');
        await expect(page).toHaveURL(/\/home/, { timeout: 5_000 });

        await page.goto('/pedido');
        await expect(page).toHaveURL(/\/home/, { timeout: 5_000 });
      });

    } // fin del test principal
  ); // fin de test()

}); // fin de test.describe()

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS COMPLEMENTARIOS — Casos de error y borde
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('SecurityEz — Casos de error y borde', () => {

  test('CU-01 [error]: Login con credenciales incorrectas muestra mensaje de error', async ({ page }) => {
    await page.goto('/login');

    await page.route('**/api/usuario/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Credenciales inválidas' }),
      });
    });

    await page.getByPlaceholder('Ej. rrendon').fill('usuario_inexistente');
    await page.getByPlaceholder('••••••••').fill('clave_incorrecta');
    await page.getByRole('button', { name: /ingresar al sistema/i }).click();

    await expect(page.locator('.swal2-popup')).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('.swal2-icon.swal2-error')).toBeVisible();

    await expect(page).toHaveURL(/\/login/);

    const token = await page.evaluate(() => localStorage.getItem('securityEZ_token'));
    expect(token).toBeNull();
  });

  test('CU-01 [borde]: El botón de login está deshabilitado con campos vacíos', async ({ page }) => {
    await page.goto('/login');

    const btnIngresar = page.getByRole('button', { name: /ingresar al sistema/i });

    await expect(btnIngresar).toBeDisabled();

    await page.getByPlaceholder('Ej. rrendon').fill('alguien');
    await expect(btnIngresar).toBeDisabled();

    await page.getByPlaceholder('••••••••').fill('clave');
    await expect(btnIngresar).toBeEnabled();
  });

  test('CU-03 [borde]: Usuario no autenticado es redirigido desde rutas admin', async ({ page }) => {
    await page.goto('/categoria');
    await expect(page).toHaveURL(/\/home/, { timeout: 5_000 });

    await page.goto('/proveedor');
    await expect(page).toHaveURL(/\/home/, { timeout: 5_000 });
  });

  test('CU-34 [borde]: Carrito vacío persiste correctamente en localStorage', async ({ page }) => {
    await page.goto('/store/carrito');

    await expect(page.getByText(/tu carrito está vacío/i)).toBeVisible({ timeout: 5_000 });

    const cartData = await page.evaluate(() => localStorage.getItem('securityEZ_cart'));
    if (cartData !== null) {
      expect(JSON.parse(cartData)).toEqual([]);
    }
  });

  test('CU-19 [borde]: El catálogo es accesible sin autenticación (ruta pública)', async ({ page }) => {
    await page.goto('/store/catalogo');

    await expect(page).toHaveURL(/\/store\/catalogo/);
    await expect(
      page.getByRole('heading', { name: /catálogo de productos/i })
    ).toBeVisible({ timeout: 10_000 });
  });

});