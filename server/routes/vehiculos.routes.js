// Importa Express para crear el router
const router = require("express").Router();

// Importa el controlador de vehículos
const ctrl = require("../controllers/vehiculos.controlador");

// ==================================================
// RUTAS - Solo enrutamiento, lógica en controlador
// ==================================================

// GET /api/vehiculos - Listar todos
router.get("/", ctrl.listar);

// GET /api/vehiculos/categorias - Categorías únicas
router.get("/categorias", ctrl.obtenerCategorias);

// POST /api/vehiculos - Crear (admin)
router.post("/", ctrl.crear);

// PUT /api/vehiculos/:id - Actualizar (admin)
router.put("/:id", ctrl.actualizar);

// DELETE /api/vehiculos/:id - Eliminar (admin)
router.delete("/:id", ctrl.eliminar);

module.exports = router;
