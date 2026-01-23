// Importa Express para crear el router
const express = require('express');
const router = express.Router();

// Importa el modelo Venta
const Venta = require('../models/venta');

// =====================================================
// GET /api/ventas/usuario/:id
// Devuelve el historial de compras de un usuario
// =====================================================
router.get('/usuario/:id', async (req, res) => {
  try {
    // Recoge el id del usuario desde la URL
    const usuarioId = req.params.id;

    // Busca todas las ventas de ese usuario y las ordena (más recientes primero)
    const ventas = await Venta.find({ usuarioId })
      .sort({ createdAt: -1 });

    // Devuelve la lista de ventas
    return res.json(ventas);
  } catch (err) {
    console.error('ERROR LISTANDO VENTAS 👉', err);
    return res.status(500).json({ msg: 'Error obteniendo historial de compras' });
  }
});

// =====================================================
// GET /api/ventas
// Devuelve TODAS las ventas (para admin)
// =====================================================
router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.find()
      .sort({ createdAt: -1 });

    return res.json(ventas);
  } catch (err) {
    console.error('ERROR LISTANDO TODAS LAS VENTAS 👉', err);
    return res.status(500).json({ msg: 'Error obteniendo todas las ventas' });
  }
});

// =====================================================
// POST /api/ventas
// Crea una venta a partir del carrito
// =====================================================
router.post('/', async (req, res) => {
  try {
    // Se obtiene el id del usuario y las líneas de venta desde el body
    const { usuarioId, lineas } = req.body;

    // Si no hay líneas o el carrito está vacío, devolvemos error
    if (!Array.isArray(lineas) || lineas.length === 0) {
      return res.status(400).json({ msg: 'El carrito está vacío' });
    }

    // Calcula el total sumando precio * cantidad de cada línea
    const total = lineas.reduce(
      (acc, l) => acc + (Number(l.precio) * Number(l.cantidad || 1)),
      0
    );

    // Crea la venta en la base de datos
    const venta = await Venta.create({
      usuarioId: usuarioId || null, // Se asocia la venta al usuario logueado
      lineas: lineas.map(l => ({
        vehiculoId: l.vehiculoId,
        titulo: l.titulo,
        precio: Number(l.precio),
        cantidad: Number(l.cantidad || 1)
      })),
      total
    });

    // Devuelve la venta creada
    return res.status(201).json(venta);

  } catch (err) {
    console.error('ERROR CREANDO VENTA 👉', err);
    return res.status(500).json({ msg: 'Error creando la venta' });
  }
});

// =====================================================
// DELETE /api/ventas/:id
// Elimina una venta (solo visible para admin en frontend)
// =====================================================
router.delete('/:id', async (req, res) => {
  try {
    await Venta.findByIdAndDelete(req.params.id);
    return res.json({ msg: 'Venta eliminada correctamente' });
  } catch (err) {
    console.error('ERROR ELIMINANDO VENTA 👉', err);
    return res.status(400).json({ msg: 'Error eliminando la venta' });
  }
});

// Exporta el router
module.exports = router;
