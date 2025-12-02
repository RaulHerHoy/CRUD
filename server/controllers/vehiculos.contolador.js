const Vehiculo = require('../models/vehiculo');
const ctrl = {};

ctrl.listar = async (req, res) => {
  const vehiculos = await Vehiculo.find();
  res.json(vehiculos);
};

ctrl.crear = async (req, res) => {
  const nuevo = new Vehiculo(req.body);
  await nuevo.save();
  res.json({ status: "Vehículo añadido" });
};

ctrl.eliminar = async (req, res) => {
  await Vehiculo.findByIdAndDelete(req.params.id);
  res.json({ status: "Vehículo eliminado" });
};

module.exports = ctrl;
