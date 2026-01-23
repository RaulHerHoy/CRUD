const mongoose = require('mongoose');
const { Schema } = mongoose;

const VehiculoSchema = new Schema({
  marca: String,
  modelo: String,
  precio: Number,
  ano: Number,
  categoria: String,
  imagen: String,
  descripcion: String
});
// GET /api/vehiculos/categorias
/*
router.get('/categorias', async (req, res) => {
  try {
    // Obtenemos categorías únicas
    const categorias = await Vehiculo.distinct('categoria');
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ msg: 'Error obteniendo categorías' });
  }
});*/

module.exports = mongoose.model("Vehiculo", VehiculoSchema);
