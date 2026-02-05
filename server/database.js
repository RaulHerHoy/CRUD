// Importa mongoose para conectar con MongoDB
const mongoose = require('mongoose');

// URI de conexión a MongoDB
const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tienda-vehiculos';

// Conecta a MongoDB
mongoose.connect(URI)
  .then(() => console.log('✔ MongoDB conectada'))
  .catch(err => console.error('❌ Error conectando MongoDB:', err));

module.exports = mongoose;