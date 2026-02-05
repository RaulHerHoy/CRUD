// Se importa el router de Express para definir las rutas
const router = require("express").Router();

// Se importa el controlador de autenticación
const ctrl = require("../controllers/auth.controlador");

// ============================
// RUTAS DE AUTENTICACIÓN
// ============================

// POST /api/auth/login - Iniciar sesión
router.post("/login", ctrl.login);

// POST /api/auth/registro - Registrar nuevo usuario
router.post("/registro", ctrl.registro);

// Se exporta el router para poder usarlo en la aplicación principal
module.exports = router;
