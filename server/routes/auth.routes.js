// Se importa el router de Express para definir las rutas
const router = require("express").Router();

// Se importa el modelo Usuario para acceder a la base de datos
const Usuario = require("../models/usuario");

// Ruta POST para iniciar sesión
router.post("/login", async (req, res) => {
  try {
    // Se extraen el email y la contraseña enviados desde el frontend
    const { email, password } = req.body;

    // Se busca un usuario en la base de datos con ese email
    const user = await Usuario.findOne({ email });

    // Si no existe el usuario, se devuelve un error
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario no existe"
      });
    }

    // Se comprueba si la contraseña introducida coincide con la almacenada
    if (user.password !== password) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta"
      });
    }

    // Si las credenciales son correctas, se envían los datos del usuario
    return res.json({
      ok: true,
      usuario: {
        _id: user._id,        // Identificador del usuario
        nombre: user.nombre,  // Nombre del usuario
        email: user.email,    // Email del usuario
        rol: user.rol,        // Rol del usuario (admin, buyer, etc.)
        tipo: user.tipo       // Tipo de usuario
      }
    });

  } catch (e) {
    // Si ocurre cualquier error inesperado, se devuelve un error del servidor
    return res.status(500).json({
      ok: false,
      msg: "Error en login"
    });
  }
});

// Ruta POST para registrar un nuevo usuario
router.post("/registro", async (req, res) => {
  try {
    // Se extraen los datos enviados desde el frontend
    const { nombre, email, password } = req.body;

    // Se comprueba si ya existe un usuario con ese email
    const existe = await Usuario.findOne({ email });

    // Si el email ya está registrado, se devuelve un error
    if (existe) {
      return res.status(400).json({
        ok: false,
        msg: "Email ya registrado"
      });
    }

    // Se crea el nuevo usuario en la base de datos
    const usuario = await Usuario.create({
      nombre,               // Nombre del usuario
      email,                // Email del usuario
      password,             // Contraseña
      tipo: "normal",       // Tipo por defecto
      rol: "buyer"          // Rol por defecto
    });

    // Se devuelve una respuesta indicando que el registro ha sido correcto
    return res.json({
      ok: true,
      msg: "Usuario registrado",
      id: usuario._id
    });

  } catch (e) {
    // Si ocurre un error durante el registro, se devuelve el mensaje
    return res.status(400).json({
      ok: false,
      msg: e.message
    });
  }
});

// Se exporta el router para poder usarlo en la aplicación principal
module.exports = router;
