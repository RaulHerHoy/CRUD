const mongoose = require('mongoose');

const lineaSchema = new mongoose.Schema({
  vehiculoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehiculo', required: true },
  titulo: { type: String, required: true },     // nombre o modelo
  precio: { type: Number, required: true },
  cantidad: { type: Number, required: true, default: 1 }
}, { _id: false });

const ventaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false }, // si hay login
  lineas: { type: [lineaSchema], required: true },
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, default: 'CONFIRMADA' }
});

module.exports = mongoose.model('Venta', ventaSchema);
