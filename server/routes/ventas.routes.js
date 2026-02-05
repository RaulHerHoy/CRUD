const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/ventas.controlador');

// ============================
// RUTAS DE VENTAS
// ============================

// GET /api/ventas/usuario/:id - Historial de compras de un usuario
router.get('/usuario/:id', ctrl.obtenerPorUsuario);

// GET /api/ventas - Listar todas las ventas (para admin)
router.get('/', ctrl.obtenerTodas);

// POST /api/ventas - Crear nueva venta
router.post('/', ctrl.crear);

// DELETE /api/ventas/:id - Eliminar venta (admin)
router.delete('/:id', ctrl.eliminar);

module.exports = router;
