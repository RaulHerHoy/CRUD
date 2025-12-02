const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsuarioSchema = new Schema({
  nombre: String,
  email: { type: String, unique: true },
  password: String,
  tipo: { type: String, enum: ['normal','premium','vip'], default: 'normal' }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
