// Importa Express para crear el router
const router = require("express").Router();

// Importa el modelo Vehiculo
const Vehiculo = require("../models/vehiculo");


// ==================================================
// GET /api/vehiculos
// Devuelve TODOS los vehículos (listado principal)
// ==================================================
router.get("/", async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find();
    res.json(vehiculos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error obteniendo vehículos" });
  }
});


// ==================================================
// GET /api/vehiculos/categorias
// Devuelve categorías únicas (para el filtro dinámico)
// ==================================================
router.get("/categorias", async (req, res) => {
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
});


// ==================================================
// POST /api/vehiculos
// Crea un vehículo nuevo (ADMIN)
// ==================================================
router.post("/", async (req, res) => {
  try {
    const nuevo = new Vehiculo(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Error creando vehículo" });
  }
});


// ==================================================
// PUT /api/vehiculos/:id
// Actualiza un vehículo existente (ADMIN)
// ==================================================
router.put("/:id", async (req, res) => {
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
});


// ==================================================
// DELETE /api/vehiculos/:id
// Elimina un vehículo (ADMIN)
// ==================================================
router.delete("/:id", async (req, res) => {
  try {
    await Vehiculo.findByIdAndDelete(req.params.id);
    res.json({ msg: "Vehículo eliminado" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Error eliminando vehículo" });
  }
});


// Exporta el router
module.exports = router;
