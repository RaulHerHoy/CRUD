const mongoose = require('mongoose');

const URI = 'mongodb://localhost:27017/cruddb';

mongoose.connect('mongodb://localhost:27017/tienda-vehiculos')
  .then(() => console.log('✔ MongoDB conectada'))
  .catch(err => console.error(err));

module.exports = mongoose;
