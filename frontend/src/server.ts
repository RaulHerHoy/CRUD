// Importa utilidades específicas de Angular SSR para Node:
// - AngularNodeAppEngine: motor que renderiza Angular en servidor
// - createNodeRequestHandler: crea un handler compatible con Angular CLI / funciones serverless
// - isMainModule: comprueba si este archivo es el punto de entrada principal
// - writeResponseToNodeResponse: escribe la respuesta SSR en el objeto res de Express
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

// Importa Express para crear un servidor HTTP en Node
import express from 'express';

// Importa join para construir rutas de archivos de forma segura
import { join } from 'node:path';

// Construye la ruta a la carpeta donde está el build del navegador (archivos estáticos)
// import.meta.dirname apunta al directorio del archivo actual (en ESM)
const browserDistFolder = join(import.meta.dirname, '../browser');

// Crea la app de Express
const app = express();

// Crea el motor SSR de Angular para atender peticiones y renderizar páginas
const angularApp = new AngularNodeAppEngine();

/**
 * Aquí podrían definirse endpoints de API REST en Express.
 * El bloque está comentado porque es un ejemplo.
 * Si se definiesen rutas tipo /api/..., se ejecutarían antes del SSR.
 *
 * Ejemplo (comentado):
 * app.get('/api/{*splat}', (req, res) => { ... });
 */

/**
 * Sirve archivos estáticos desde la carpeta /browser (build del cliente).
 * Esto cubre assets como JS, CSS, imágenes, etc.
 */
app.use(
  // express.static monta un middleware para servir ficheros estáticos
  express.static(browserDistFolder, {
    // Cachea archivos estáticos durante 1 año (útil en producción con archivos con hash)
    maxAge: '1y',

    // No sirve automáticamente index.html como fallback (lo hará SSR)
    index: false,

    // No redirige rutas con o sin slash final
    redirect: false,
  }),
);

/**
 * Maneja todas las demás peticiones renderizando la aplicación Angular en servidor (SSR).
 * Este middleware se ejecuta si la petición no ha sido resuelta por estáticos u otras rutas anteriores.
 */
app.use((req, res, next) => {
  // angularApp.handle procesa la request y devuelve una Promise con una Response (o null)
  angularApp
    .handle(req)
    .then((response) =>
      // Si Angular devuelve una respuesta, se escribe en res y se termina la petición
      // Si no devuelve respuesta, se pasa al siguiente middleware (next)
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    // Si hay error en el render SSR, se pasa al manejador de errores de Express
    .catch(next);
});

/**
 * Arranca el servidor solo si este archivo es el módulo principal ejecutado.
 * Si se importa desde otro sitio (por ejemplo, en serverless), no hace app.listen aquí.
 */
if (isMainModule(import.meta.url)) {
  // Usa el puerto definido en la variable de entorno PORT o, si no existe, el 4000
  const port = process.env['PORT'] || 4000;

  // Inicia el servidor Express en el puerto indicado
  app.listen(port, (error) => {
    // Si hay error arrancando el servidor, lanza excepción
    if (error) {
      throw error;
    }

    // Mensaje informativo en consola con la URL local
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Handler de request que usa Angular CLI (dev-server y build) o entornos tipo Firebase Functions.
 * Exportarlo permite que otros runtimes reutilicen la app Express sin arrancar el servidor manualmente.
 */
export const reqHandler = createNodeRequestHandler(app);
