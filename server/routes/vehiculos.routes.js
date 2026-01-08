const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vehiculos.controlador');

router.get('/', ctrl.listar);
router.post('/', ctrl.crear);
router.delete('/:id', ctrl.eliminar);
router.put('/:id', ctrl.actualizar);

module.exports = router;
