// Importa Express para crear el servidor backend
const express = require('express');

// Importa cors para permitir peticiones desde otros orígenes (frontend)
const cors = require('cors');

// Importa morgan para mostrar logs de las peticiones HTTP en consola
const morgan = require('morgan');

// Importa el archivo de conexión a la base de datos MongoDB
require('./database');

// Crea la aplicación Express
const app = express();

// ============================
// CONFIGURACIÓN
// ============================

// Define el puerto del servidor
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

// Rutas de autenticación (login, registro)
app.use("/api/auth", require("./routes/auth.routes"));

// Rutas de vehículos (listar, crear, editar, eliminar)
app.use('/api/vehiculos', require('./routes/vehiculos.routes'));

// Rutas de ventas (historial, creación, borrado)
app.use('/api/ventas', require('./routes/ventas.routes'));

// ============================
// ARRANQUE DEL SERVIDOR
// ============================

// Inicia el servidor en el puerto configurado
app.listen(app.get('port'), () => {
  console.log('✔ Servidor Node en puerto', app.get('port'));
});