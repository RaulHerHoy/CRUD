const mongoose = require('mongoose');
const { Schema } = mongoose;

const CarritoSchema = new Schema({
  usuarioId: { type: Schema.Types.ObjectId, ref: "Usuario" },
  items: [
    {
      vehiculoId: { type: Schema.Types.ObjectId, ref: "Vehiculo" },
      cantidad: Number
    }
  ]
});

module.exports = mongoose.model("Carrito", CarritoSchema);
