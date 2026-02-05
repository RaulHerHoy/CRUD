const Venta = require('../models/venta');

const ctrl = {};

// =====================================================
// HISTORIAL DE COMPRAS DE UN USUARIO
// =====================================================
ctrl.obtenerPorUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const ventas = await Venta.find({ usuarioId }).sort({ createdAt: -1 });
    return res.json(ventas);
  } catch (err) {
    console.error('ERROR LISTANDO VENTAS', err);
    return res.status(500).json({ msg: 'Error obteniendo historial de compras' });
  }
};

// =====================================================
// TODAS LAS VENTAS (ADMIN)
// =====================================================
ctrl.obtenerTodas = async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ createdAt: -1 });
    return res.json(ventas);
  } catch (err) {
    console.error('ERROR LISTANDO TODAS LAS VENTAS', err);
    return res.status(500).json({ msg: 'Error obteniendo todas las ventas' });
  }
};

// =====================================================
// CREAR VENTA (FORMALIZAR COMPRA)
// =====================================================
ctrl.crear = async (req, res) => {
  try {
    const { usuarioId, lineas } = req.body;

    if (!Array.isArray(lineas) || lineas.length === 0) {
      return res.status(400).json({ msg: 'El carrito está vacío' });
    }

    const total = lineas.reduce(
      (acc, l) => acc + (Number(l.precio) * Number(l.cantidad || 1)),
      0
    );

    const venta = await Venta.create({
      usuarioId: usuarioId || null,
      lineas: lineas.map(l => ({
        vehiculoId: l.vehiculoId,
        titulo: l.titulo,
        precio: Number(l.precio),
        cantidad: Number(l.cantidad || 1)
      })),
      total
    });

    return res.status(201).json(venta);
  } catch (err) {
    console.error('ERROR CREANDO VENTA', err);
    return res.status(500).json({ msg: 'Error creando la venta' });
  }
};

// =====================================================
// ELIMINAR VENTA (ADMIN)
// =====================================================
ctrl.eliminar = async (req, res) => {
  try {
    await Venta.findByIdAndDelete(req.params.id);
    return res.json({ msg: 'Venta eliminada correctamente' });
  } catch (err) {
    console.error('ERROR ELIMINANDO VENTA', err);
    return res.status(400).json({ msg: 'Error eliminando la venta' });
  }
};

module.exports = ctrl;
