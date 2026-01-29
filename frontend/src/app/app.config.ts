// Importa tipos y proveedores generales de la app
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  APP_INITIALIZER,
  inject
} from '@angular/core';

// Importa el proveedor del router
import { provideRouter } from '@angular/router';

// Importa el cliente HTTP y fetch
import { provideHttpClient, withFetch } from '@angular/common/http';

// Importa las rutas de la aplicación
import { routes } from './app.routes';

// 🔹 Servicios propios
import { UsuariosService } from './services/usuarios.service';
import { CarritoService } from './services/carrito.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // Activa listeners globales de errores en el navegador
    provideBrowserGlobalErrorListeners(),

    // Mejora el rendimiento agrupando eventos de detección de cambios
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Configura el sistema de rutas
    provideRouter(routes),

    // Configura HttpClient sin interceptores
    provideHttpClient(withFetch()),

    // ✅ Inicializador de la app (recarga / F5)
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const usuarios = inject(UsuariosService);
        const carrito = inject(CarritoService);

        return () => {
          // Si hay usuario guardado, cargamos SU carrito
          const u = usuarios.obtenerUsuario();
          const userId = u?._id ?? u?.id ?? u?.email ?? null;

          // ⚠️ IMPORTANTE:
          // aquí SOLO cargamos, NO vaciamos
          carrito.setUser(userId);
        };
      }
    }
  ]
};
