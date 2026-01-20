const express = require('express');
const router = express.Router();
const Venta = require('../models/venta');

// POST /api/ventas
router.post('/', async (req, res) => {
  try {
    const { userId, lineas } = req.body;

    if (!Array.isArray(lineas) || lineas.length === 0) {
      return res.status(400).json({ msg: 'El carrito está vacío' });
    }

    const total = lineas.reduce((acc, l) => acc + (Number(l.precio) * Number(l.cantidad || 1)), 0);

    const venta = await Venta.create({
      userId: userId || null,
      lineas: lineas.map(l => ({
        vehiculoId: l.vehiculoId,
        titulo: l.titulo,
        precio: Number(l.precio),
        cantidad: Number(l.cantidad || 1),
      })),
      total
    });

    res.status(201).json(venta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creando la venta' });
  }
});

module.exports = router;
