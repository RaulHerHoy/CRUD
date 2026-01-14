const router = require("express").Router();
const Usuario = require("../models/usuario");
const authJWT = require("../middlewares/authJWT");
const adminOnly = require("../middlewares/adminOnly");

// Cambiar tipo
router.patch("/usuarios/:id/tipo", authJWT, adminOnly, async (req, res) => {
  const { tipo } = req.body;
  if (!["normal", "premium", "vip"].includes(tipo)) {
    return res.status(400).json({ ok: false, msg: "Tipo inválido" });
  }

  const user = await Usuario.findByIdAndUpdate(req.params.id, { tipo }, { new: true })
    .select("-password");

  res.json({ ok: true, user });
});

// Hacer admin (solo admin crea otro admin)
router.patch("/usuarios/:id/hacer-admin", authJWT, adminOnly, async (req, res) => {
  const user = await Usuario.findByIdAndUpdate(req.params.id, { rol: "admin" }, { new: true })
    .select("-password");

  res.json({ ok: true, user });
});

module.exports = router;
