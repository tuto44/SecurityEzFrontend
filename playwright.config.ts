import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para SecurityEz.
 * Documentación: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Ejecutar tests en paralelo dentro de cada archivo
  fullyParallel: true,

  // Fallar el build en CI si se dejó un test.only accidentalmente
  forbidOnly: !!process.env['CI'],

  // Reintentos solo en CI
  retries: process.env['CI'] ? 2 : 0,

  // Un solo worker en CI para evitar condiciones de carrera
  workers: process.env['CI'] ? 1 : undefined,

  // Reporter HTML para visualizar resultados
  reporter: [['html', { open: 'never' }]],

  use: {
    // URL base de la aplicación Angular en desarrollo
    baseURL: 'http://localhost:4200',

    // Capturar trace en el primer reintento para debugging
    trace: 'on-first-retry',

    // Screenshot solo cuando falla
    screenshot: 'only-on-failure',

    // Video solo cuando falla
    video: 'retain-on-failure',

    // Timeout por acción (ms)
    actionTimeout: 10_000,

    // Timeout de navegación (ms)
    navigationTimeout: 30_000,
  },

  // Timeout global por test (ms)
  timeout: 60_000,

  // Proyectos de navegadores
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Servidor de desarrollo — descomenta si quieres que Playwright lo levante automáticamente
webServer: {
command: 'ng s',
url: 'http://localhost:4200',
reuseExistingServer: !process.env['CI'],
timeout: 120_000,
},
});
