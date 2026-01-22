// Importa tipos y proveedores generales de la app
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

// Importa el proveedor del router
import { provideRouter } from '@angular/router';

// Importa el cliente HTTP y fetch
import { provideHttpClient, withFetch } from '@angular/common/http';

// Importa las rutas de la aplicación
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Activa listeners globales de errores en el navegador
    provideBrowserGlobalErrorListeners(),

    // Mejora el rendimiento agrupando eventos de detección de cambios
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Configura el sistema de rutas
    provideRouter(routes),

    // Configura HttpClient sin interceptores
    provideHttpClient(
      withFetch()
    )
  ]
};
