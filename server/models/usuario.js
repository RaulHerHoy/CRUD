const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  password: { type: String, required: true },

  tipo: { type: String, enum: ["normal", "premium", "vip"], default: "normal" },
  rol:  { type: String, enum: ["buyer", "admin"], default: "buyer" }
}, { timestamps: true });

module.exports = mongoose.model("Usuario", UsuarioSchema);
