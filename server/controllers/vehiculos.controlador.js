// Importa el modelo Vehiculo desde la carpeta models
const Vehiculo = require('../models/vehiculo');

// Objeto controlador donde se agrupan las funciones relacionadas con vehículos
const ctrl = {};

// ----------------------------
// LISTAR VEHÍCULOS
// ----------------------------

// Devuelve todos los vehículos almacenados en la base de datos
ctrl.listar = async (req, res) => {

  // Busca todos los documentos de la colección Vehiculo
  const vehiculos = await Vehiculo.find();

  // Envía la lista de vehículos en formato JSON
  res.json(vehiculos);
};

// ----------------------------
// CREAR VEHÍCULO
// ----------------------------

// Crea un nuevo vehículo con los datos recibidos en el body
ctrl.crear = async (req, res) => {

  // Crea una nueva instancia del modelo Vehiculo con los datos del request
  const nuevo = new Vehiculo(req.body);

  // Guarda el nuevo vehículo en la base de datos
  await nuevo.save();

  // Devuelve un mensaje de confirmación
  res.json({ status: "Vehículo añadido" });
};

// ----------------------------
// ELIMINAR VEHÍCULO
// ----------------------------

// Elimina un vehículo según su id recibido por parámetros de la URL
ctrl.eliminar = async (req, res) => {

  // Busca el vehículo por id y lo elimina de la base de datos
  await Vehiculo.findByIdAndDelete(req.params.id);

  // Devuelve un mensaje de confirmación
  res.json({ status: "Vehículo eliminado" });
};

// ----------------------------
// ACTUALIZAR VEHÍCULO
// ----------------------------

// Actualiza un vehículo existente según su id
ctrl.actualizar = async (req, res) => {

  // Busca el vehículo por id y actualiza sus datos con el body recibido
  // { new: true } indica que Mongoose devuelva el documento actualizado
  await Vehiculo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  // Devuelve un mensaje de confirmación
  res.json({ status: "Vehículo actualizado" });
};

// Exporta el controlador para poder usarlo en las rutas
module.exports = ctrl;
