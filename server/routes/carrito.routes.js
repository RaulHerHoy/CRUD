const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/carrito.controlador');

router.get('/:id', ctrl.obtener); 
router.post('/add', ctrl.agregar);

module.exports = router;
