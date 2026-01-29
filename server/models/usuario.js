// Importa la librería mongoose para trabajar con MongoDB
const mongoose = require("mongoose");

// Define el esquema del usuario
const UsuarioSchema = new mongoose.Schema({

  // Nombre del usuario
  // required: true obliga a que siempre tenga valor
  nombre: { type: String, required: true },

  // Email del usuario
  // required: true obliga a que exista
  // unique: true impide que haya dos usuarios con el mismo email
  email:  { type: String, required: true, unique: true },

  // Contraseña del usuario
  // Se espera que esté cifrada antes de guardarse en la base de datos
  password: { type: String, required: true },

  // Tipo de usuario
  // Solo puede tomar uno de los valores definidos en enum
  // Si no se indica, por defecto será "normal"
  tipo: { type: String, enum: ["normal", "premium", "vip"], default: "normal" },

  // Rol del usuario dentro del sistema
  // "buyer" es un usuario normal comprador
  // "admin" tiene permisos de administración
  rol:  { type: String, enum: ["buyer", "admin"], default: "buyer" }

}, {
  // Añade automáticamente los campos createdAt y updatedAt
  timestamps: true
});

// Exporta el modelo Usuario basado en el esquema definido
module.exports = mongoose.model("Usuario", UsuarioSchema);
