// Importa Express para crear el router
const express = require('express');

// Crea una instancia del router de Express
const router = express.Router();

// Importa el modelo Venta para interactuar con la colección de ventas
const Venta = require('../models/venta');

// =====================================================
// GET /api/ventas/usuario/:id
// Devuelve el historial de compras de un usuario
// =====================================================
router.get('/usuario/:id', async (req, res) => {
  try {
    // Recoge el id del usuario desde los parámetros de la URL
    const usuarioId = req.params.id;

    // Busca todas las ventas asociadas a ese usuario
    // sort({ createdAt: -1 }) ordena por fecha descendente (más recientes primero)
    const ventas = await Venta.find({ usuarioId })
      .sort({ createdAt: -1 });

    // Devuelve la lista de ventas en formato JSON
    return res.json(ventas);
  } catch (err) {
    // Muestra el error en consola para depuración
    console.error('ERROR LISTANDO VENTAS', err);

    // Devuelve un error 500 al cliente
    return res.status(500).json({ msg: 'Error obteniendo historial de compras' });
  }
});

// =====================================================
// GET /api/ventas
// Devuelve TODAS las ventas (para admin)
// =====================================================
router.get('/', async (req, res) => {
  try {
    // Busca todas las ventas existentes en la base de datos
    // Se ordenan por fecha de creación descendente
    const ventas = await Venta.find()
      .sort({ createdAt: -1 });

    // Devuelve todas las ventas en formato JSON
    return res.json(ventas);
  } catch (err) {
    // Muestra el error en consola
    console.error('ERROR LISTANDO TODAS LAS VENTAS', err);

    // Devuelve un error 500 al cliente
    return res.status(500).json({ msg: 'Error obteniendo todas las ventas' });
  }
});

// =====================================================
// POST /api/ventas
// Crea una venta a partir del carrito
// =====================================================
router.post('/', async (req, res) => {
  try {
    // Extrae del body el id del usuario y las líneas de venta
    const { usuarioId, lineas } = req.body;

    // Comprueba que las líneas existen y que el carrito no esté vacío
    if (!Array.isArray(lineas) || lineas.length === 0) {
      return res.status(400).json({ msg: 'El carrito está vacío' });
    }

    // Calcula el total de la venta
    // Suma precio * cantidad de cada línea
    const total = lineas.reduce(
      (acc, l) => acc + (Number(l.precio) * Number(l.cantidad || 1)),
      0
    );

    // Crea la venta en la base de datos
    const venta = await Venta.create({
      // Asocia la venta al usuario logueado (o null si no hay usuario)
      usuarioId: usuarioId || null,

      // Mapea las líneas recibidas al formato esperado por el modelo Venta
      lineas: lineas.map(l => ({
        vehiculoId: l.vehiculoId,
        titulo: l.titulo,
        precio: Number(l.precio),
        cantidad: Number(l.cantidad || 1)
      })),

      // Guarda el total calculado
      total
    });

    // Devuelve la venta creada con estado 201 (creado)
    return res.status(201).json(venta);

  } catch (err) {
    // Muestra el error en consola
    console.error('ERROR CREANDO VENTA', err);

    // Devuelve un error 500 al cliente
    return res.status(500).json({ msg: 'Error creando la venta' });
  }
});

// =====================================================
// DELETE /api/ventas/:id
// Elimina una venta (solo visible para admin en frontend)
// =====================================================
router.delete('/:id', async (req, res) => {
  try {
    // Elimina la venta cuyo id se recibe por parámetros de la URL
    await Venta.findByIdAndDelete(req.params.id);

    // Devuelve mensaje de confirmación
    return res.json({ msg: 'Venta eliminada correctamente' });
  } catch (err) {
    // Muestra el error en consola
    console.error('ERROR ELIMINANDO VENTA', err);

    // Devuelve un error 400 al cliente
    return res.status(400).json({ msg: 'Error eliminando la venta' });
  }
});

// Exporta el router para poder montarlo en la aplicación principal
module.exports = router;
