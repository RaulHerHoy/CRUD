const router = require("express").Router();
const Usuario = require("../models/usuario");
const jwt = require("jsonwebtoken");
// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.findOne({ email });
    if (!user) return res.status(400).json({ ok: false, msg: "Usuario no existe" });

    // (por ahora sin bcrypt)
    if (user.password !== password) {
      return res.status(400).json({ ok: false, msg: "Contraseña incorrecta" });
    }

    // 🔥 Token con rol y tipo
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        rol: user.rol,
        tipo: user.tipo
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      token,
      usuario: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        tipo: user.tipo
      }
    });
  } catch (e) {
    res.status(500).json({ ok: false, msg: "Error en login" });
  }
});
router.post("/registro", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ ok: false, msg: "Email ya registrado" });

    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      tipo: "normal",
      rol: "buyer"
    });

    res.json({ ok: true, msg: "Usuario registrado", id: usuario._id });
  } catch (e) {
    res.status(400).json({ ok: false, msg: e.message });
  }
});

module.exports = router;
