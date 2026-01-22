// Se importa el router de Express
const router = require("express").Router();

// Se importa el modelo Usuario para acceder a la base de datos
const Usuario = require("../models/usuario");

// Middlewares importados (authJWT está desactivado y no bloquea rutas)
const authJWT = require("../middlewares/authJWT");
const adminOnly = require("../middlewares/adminOnly");

// Ruta para cambiar el tipo de usuario
router.patch("/usuarios/:id/tipo", authJWT, adminOnly, async (req, res) => {
  try {
    // Se obtiene el tipo enviado en el body
    const { tipo } = req.body;

    // Se valida que el tipo sea uno permitido
    if (!["normal", "premium", "vip"].includes(tipo)) {
      return res.status(400).json({ ok: false, msg: "Tipo inválido" });
    }

    // Se actualiza el tipo del usuario y se excluye la contraseña
    const user = await Usuario.findByIdAndUpdate(
      req.params.id,
      { tipo },
      { new: true }
    ).select("-password");

    // Se devuelve el usuario actualizado
    return res.json({ ok: true, user });

  } catch (e) {
    // Error genérico de servidor
    return res.status(500).json({ ok: false, msg: "Error actualizando tipo" });
  }
});

// Ruta para convertir un usuario en administrador
router.patch("/usuarios/:id/hacer-admin", authJWT, adminOnly, async (req, res) => {
  try {
    // Se actualiza el rol del usuario a admin
    const user = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol: "admin" },
      { new: true }
    ).select("-password");

    // Se devuelve el usuario actualizado
    return res.json({ ok: true, user });

  } catch (e) {
    // Error genérico de servidor
    return res.status(500).json({ ok: false, msg: "Error haciendo admin" });
  }
});

// Se exporta el router para usarlo en la app principal
module.exports = router;
