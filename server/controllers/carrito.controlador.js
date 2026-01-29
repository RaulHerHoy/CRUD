// Importa el modelo Carrito desde la carpeta models
const Carrito = require('../models/carrito');

// Objeto controlador donde se definen las funciones relacionadas con el carrito
const ctrl = {};

// ----------------------------
// OBTENER CARRITO DE UN USUARIO
// ----------------------------

// Función asíncrona para obtener el carrito de un usuario concreto
ctrl.obtener = async (req, res) => {

  // Busca un carrito cuyo usuarioId coincida con el id recibido por parámetros de la URL
  // populate("items.vehiculoId") sustituye el id del vehículo por el documento completo
  const carrito = await Carrito
    .findOne({ usuarioId: req.params.id })
    .populate("items.vehiculoId");

  // Devuelve el carrito en formato JSON como respuesta
  res.json(carrito);
};

// ----------------------------
// AÑADIR VEHÍCULO AL CARRITO
// ----------------------------

// Función asíncrona para añadir un vehículo al carrito
ctrl.agregar = async (req, res) => {

  // Extrae usuarioId y vehiculoId del cuerpo de la petición
  const { usuarioId, vehiculoId } = req.body;

  // Busca el carrito del usuario en la base de datos
  let carrito = await Carrito.findOne({ usuarioId });

  // Si el usuario no tiene carrito todavía, se crea uno nuevo vacío
  if (!carrito) {
    carrito = new Carrito({ usuarioId, items: [] });
  }

  // Añade un nuevo item al carrito con cantidad inicial 1
  carrito.items.push({ vehiculoId, cantidad: 1 });

  // Guarda el carrito en la base de datos
  await carrito.save();

  // Devuelve un mensaje de confirmación
  res.json({ status: "Añadido al carrito" });
};

// Exporta el controlador para poder usarlo en las rutas
module.exports = ctrl;
