// Importa Express para crear el router
const express = require('express');
const router = express.Router();

// Importa el modelo Venta
const Venta = require('../models/venta');
// GET /api/ventas/usuario/:id
// Devuelve el historial de compras de un usuario (ordenadas de más nuevas a más antiguas)
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

// POST /api/ventas
// Crea una venta a partir del carrito
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
        vehiculoId: l.vehiculoId,     // Id del vehículo
        titulo: l.titulo,             // Marca + modelo
        precio: Number(l.precio),     // Precio unitario
        cantidad: Number(l.cantidad || 1) // Cantidad comprada
      })),
      total                             // Total calculado
    });

    // Devuelve la venta creada
    return res.status(201).json(venta);

  } catch (err) {
    // Muestra error en consola y devuelve mensaje genérico
    console.error('ERROR CREANDO VENTA 👉', err);
    return res.status(500).json({ msg: 'Error creando la venta' });
  }
});

// Exporta el router
module.exports = router;
