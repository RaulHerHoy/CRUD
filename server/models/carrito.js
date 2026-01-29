// Importa la librería mongoose para trabajar con MongoDB
const mongoose = require('mongoose');

// Extrae el constructor Schema desde mongoose
const { Schema } = mongoose;

// Define el esquema del carrito
const CarritoSchema = new Schema({

  // Identificador del usuario propietario del carrito
  // Se guarda como ObjectId y referencia al modelo "Usuario"
  usuarioId: { type: Schema.Types.ObjectId, ref: "Usuario" },

  // Array de items del carrito
  items: [
    {
      // Referencia al vehículo añadido al carrito
      // Se guarda como ObjectId y referencia al modelo "Vehiculo"
      vehiculoId: { type: Schema.Types.ObjectId, ref: "Vehiculo" },

      // Cantidad de unidades de ese vehículo
      cantidad: Number
    }
  ]
});

// Exporta el modelo Carrito basado en el esquema definido
module.exports = mongoose.model("Carrito", CarritoSchema);
