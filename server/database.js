const mongoose = require('mongoose');

const URI = 'mongodb://localhost:27017/cruddb';

mongoose.connect(URI)
  .then(() => console.log('✔ MongoDB conectada'))
  .catch(err => console.error(err));

module.exports = mongoose;
