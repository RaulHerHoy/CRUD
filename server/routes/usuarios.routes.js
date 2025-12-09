const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controlador');

router.post('/register', ctrl.registrar);
router.post('/login', ctrl.login);

module.exports = router;
