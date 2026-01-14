const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('./database'); // conecta MongoDB

const app = express();

// CONFIG
app.set('port', process.env.PORT || 5000);

// MIDDLEWARES
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(morgan('dev'));
app.use(express.json());

// RUTAS
app.use("/api/auth", require("./routes/auth.routes"));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use("/api/admin", require("./routes/admin.routes"));
app.use('/api/vehiculos', require('./routes/vehiculos.routes'));
app.use('/api/carrito', require('./routes/carrito.routes'));

app.listen(app.get('port'), () => {
  console.log('✔ Servidor Node en puerto', app.get('port'));
});
