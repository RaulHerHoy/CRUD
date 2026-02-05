const Vehiculo = require('../models/vehiculo');

const ctrl = {};

// ==================================================
// LISTAR TODOS LOS VEHÍCULOS
// ==================================================
ctrl.listar = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find();
    res.json(vehiculos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error obteniendo vehículos" });
  }
};

// ==================================================
// OBTENER CATEGORÍAS ÚNICAS
// ==================================================
ctrl.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Vehiculo.distinct("categoria");

    const limpias = categorias
      .filter(c => typeof c === "string" && c.trim().length > 0)
      .map(c => c.trim())
      .sort((a, b) => a.localeCompare(b));

    res.json(limpias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error obteniendo categorías" });
  }
};

// ==================================================
// CREAR VEHÍCULO (ADMIN)
// ==================================================
ctrl.crear = async (req, res) => {
  try {
    const nuevo = new Vehiculo(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Error creando vehículo" });
  }
};

// ==================================================
// ACTUALIZAR VEHÍCULO (ADMIN)
// ==================================================
ctrl.actualizar = async (req, res) => {
  try {
    const actualizado = await Vehiculo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(actualizado);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Error actualizando vehículo" });
  }
};

// ==================================================
// ELIMINAR VEHÍCULO (ADMIN)
// ==================================================
ctrl.eliminar = async (req, res) => {
  try {
    await Vehiculo.findByIdAndDelete(req.params.id);
    res.json({ msg: "Vehículo eliminado" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Error eliminando vehículo" });
  }
};

module.exports = ctrl;
