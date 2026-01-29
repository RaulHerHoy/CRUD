// Importa Express para crear el sistema de rutas
const express = require('express');

// Crea una instancia del router de Express
const router = express.Router();

// Importa el controlador del carrito
// Contiene la lógica de obtener y añadir productos al carrito
const ctrl = require('../controllers/carrito.controlador');

// ----------------------------
// RUTAS DEL CARRITO
// ----------------------------

// Ruta GET /:id
// Obtiene el carrito del usuario cuyo id se recibe por parámetro
router.get('/:id', ctrl.obtener);

// Ruta POST /add
// Añade un vehículo al carrito
// Los datos (usuarioId y vehiculoId) se envían en el body
router.post('/add', ctrl.agregar);

// Exporta el router para usarlo en app.use(...)
module.exports = router;

