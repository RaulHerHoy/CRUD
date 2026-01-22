// Importa el modelo Usuario para acceder a la base de datos
const Usuario = require('../models/usuario');

// Importa bcrypt para cifrar y comprobar contraseñas
const bcrypt = require('bcryptjs');

// Objeto controlador donde guardamos las funciones
const ctrl = {};

// Controlador para registrar un usuario
ctrl.registrar = async (req, res) => {
  try {
    // Extrae datos enviados desde el frontend
    const { nombre, email, password, tipo } = req.body;

    // Comprueba si ya existe un usuario con ese email
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ ok: false, msg: "Email ya existe" });
    }

    // Cifra la contraseña antes de guardarla en la base de datos
    const hash = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario con la contraseña cifrada
    const nuevo = new Usuario({
      nombre,                 // Nombre del usuario
      email,                  // Email del usuario
      password: hash,         // Contraseña cifrada
      tipo: tipo || "normal", // Tipo por defecto si no viene
      rol: "buyer"            // Rol por defecto (ajusta si lo necesitas)
    });

    // Guarda el usuario en la base de datos
    await nuevo.save();

    // Devuelve respuesta indicando que el registro fue correcto
    return res.json({ ok: true, msg: "Registrado correctamente" });

  } catch (e) {
    // Si ocurre un error, devuelve mensaje de servidor
    return res.status(500).json({ ok: false, msg: "Error registrando usuario" });
  }
};

// Controlador para login
ctrl.login = async (req, res) => {
  try {
    // Extrae email y contraseña enviados por el frontend
    const { email, password } = req.body;

    // Busca el usuario en la base de datos por email
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(400).json({ ok: false, msg: "Usuario no encontrado" });
    }

    // Compara la contraseña introducida con la contraseña cifrada
    const coincide = await bcrypt.compare(password, user.password);
    if (!coincide) {
      return res.status(400).json({ ok: false, msg: "Contraseña incorrecta" });
    }

    // Si todo es correcto, devuelve los datos del usuario (sin tokens)
    return res.json({
      ok: true,
      usuario: {
        _id: user._id,        // Id del usuario
        nombre: user.nombre,  // Nombre
        email: user.email,    // Email
        rol: user.rol,        // Rol
        tipo: user.tipo       // Tipo
      }
    });

  } catch (e) {
    // Si ocurre un error, devuelve mensaje de servidor
    return res.status(500).json({ ok: false, msg: "Error en login" });
  }
};

// Controlador para listar todos los usuarios
ctrl.listarU = async (req, res) => {
  try {
    // Obtiene todos los usuarios de la base de datos
    const usuarios = await Usuario.find();

    // Devuelve la lista de usuarios
    return res.json(usuarios);

  } catch (e) {
    // Si ocurre un error, devuelve mensaje de servidor
    return res.status(500).json({ ok: false, msg: "Error listando usuarios" });
  }
};

// Exporta el controlador para usarlo en las rutas
module.exports = ctrl;
