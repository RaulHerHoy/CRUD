// Importa Express para crear el servidor backend
const express = require('express');

// Importa cors para permitir peticiones desde otros orígenes (frontend)
const cors = require('cors');

// Importa morgan para mostrar logs de las peticiones HTTP en consola
const morgan = require('morgan');

// Importa las rutas de ventas
const ventasRoutes = require('./routes/ventas.routes');

// Importa el archivo de conexión a la base de datos MongoDB
// Al requerirlo, se ejecuta automáticamente la conexión
require('./database');

// Crea la aplicación Express
const app = express();

// ============================
// CONFIGURACIÓN
// ============================

// Define el puerto del servidor
// Usa la variable de entorno PORT o, si no existe, el 5000
app.set('port', process.env.PORT || 5000);

// ============================
// MIDDLEWARES
// ============================

// Habilita CORS solo para el frontend en localhost:4200 (Angular)
app.use(cors({ origin: 'http://localhost:4200' }));

// Muestra en consola las peticiones HTTP entrantes (modo desarrollo)
app.use(morgan('dev'));

// Permite leer JSON en el body de las peticiones
app.use(express.json());

// ============================
// RUTAS
// ============================

// Rutas de autenticación (login, registro, etc.)
app.use("/api/auth", require("./routes/auth.routes"));

// Rutas relacionadas con usuarios
app.use('/api/usuarios', require('./routes/usuarios.routes'));

// Rutas de administración (acciones solo para admin)
app.use("/api/admin", require("./routes/admin.routes"));

// Rutas de vehículos (listar, crear, editar, eliminar)
app.use('/api/vehiculos', require('./routes/vehiculos.routes'));

// Rutas del carrito de la compra
app.use('/api/carrito', require('./routes/carrito.routes'));

// Rutas de ventas (historial, creación, borrado)
app.use('/api/ventas', ventasRoutes);

// ============================
// ARRANQUE DEL SERVIDOR
// ============================

// Inicia el servidor en el puerto configurado
app.listen(app.get('port'), () => {
  // Mensaje de confirmación en consola
  console.log('✔ Servidor Node en puerto', app.get('port'));
});
