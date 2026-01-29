// Importa Express para poder definir rutas HTTP
const express = require('express');

// Crea una instancia del router de Express
const router = express.Router();

// Importa el controlador de usuarios
// Contiene la lógica de registro, login y listado de usuarios
const ctrl = require('../controllers/usuarios.controlador');

// ----------------------------
// RUTAS DE USUARIOS / AUTENTICACIÓN
// ----------------------------

// Ruta POST /register
// Registra un nuevo usuario con los datos enviados en el body
router.post('/register', ctrl.registrar);

// Ruta POST /login
// Autentica a un usuario usando email y contraseña
router.post('/login', ctrl.login);

// Ruta GET /
// Devuelve el listado de usuarios
router.get('/', ctrl.listarU);

// Exporta el router para poder montarlo en app.use(...)
module.exports = router;
