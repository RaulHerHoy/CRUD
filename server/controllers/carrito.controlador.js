const Carrito = require('../models/carrito');
const ctrl = {};

ctrl.obtener = async (req, res) => {
  const carrito = await Carrito.findOne({ usuarioId: req.params.id }).populate("items.vehiculoId");
  res.json(carrito);
};

ctrl.agregar = async (req, res) => {
  const { usuarioId, vehiculoId } = req.body;

  let carrito = await Carrito.findOne({ usuarioId });

  if (!carrito) {
    carrito = new Carrito({ usuarioId, items: [] });
  }

  carrito.items.push({ vehiculoId, cantidad: 1 });

  await carrito.save();
  res.json({ status: "Añadido al carrito" });
};

module.exports = ctrl;
