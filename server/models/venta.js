// Importa mongoose para definir esquemas y modelos
const mongoose = require('mongoose');

// ================================
// ESQUEMA DE LÍNEA DE VENTA
// (cada producto comprado)
// ================================
const lineaSchema = new mongoose.Schema(
  {
    // Referencia al vehículo comprado
    vehiculoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehiculo',
      required: true
    },

    // Texto descriptivo (marca + modelo)
    titulo: {
      type: String,
      required: true
    },

    // Precio unitario en el momento de la compra
    precio: {
      type: Number,
      required: true
    },

    // Cantidad comprada
    cantidad: {
      type: Number,
      required: true,
      default: 1
    }
  },
  {
    _id: false // No necesitamos id propio para cada línea
  }
);

// ================================
// ESQUEMA DE VENTA
// ================================
const ventaSchema = new mongoose.Schema(
  {
    // Usuario que realiza la compra
    // Se guarda el _id del usuario logueado
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false
    },

    // Lista de productos comprados
    lineas: {
      type: [lineaSchema],
      required: true
    },

    // Total de la compra
    total: {
      type: Number,
      required: true
    },

    // Estado de la venta (útil para ampliar a futuro)
    estado: {
      type: String,
      default: 'CONFIRMADA'
    }
  },
  {
    timestamps: true // createdAt y updatedAt automáticos
  }
);

// Exporta el modelo Venta
module.exports = mongoose.model('Venta', ventaSchema);
