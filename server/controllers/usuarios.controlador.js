const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ctrl = {};

ctrl.registrar = async (req, res) => {
  const { nombre, email, password, tipo } = req.body;

  const existe = await Usuario.findOne({ email });
  if (existe) return res.json({ error: "Email ya existe" });

  const hash = await bcrypt.hash(password, 10);

  const nuevo = new Usuario({ nombre, email, password: hash, tipo });
  await nuevo.save();

  res.json({ status: "Registrado correctamente" });
};

ctrl.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Usuario.findOne({ email });
  if (!user) return res.json({ error: "Usuario no encontrado" });

  const coincide = await bcrypt.compare(password, user.password);
  if (!coincide) return res.json({ error: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: user._id, tipo: user.tipo },
    "CLAVE_SECRETA",
    { expiresIn: "5h" }
  );

  res.json({ token, tipo: user.tipo });
};
ctrl.listarU = async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
};

module.exports = ctrl;
