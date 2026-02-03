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


module.exports = mongoose.model("Vehiculo", VehiculoSchema);
