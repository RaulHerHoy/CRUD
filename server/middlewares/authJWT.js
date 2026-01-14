const jwt = require("jsonwebtoken");

module.exports = function authJWT(req, res, next) {
  try {
    const header = req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ ok: false, msg: "No token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = payload; // aquí vienen id, rol, tipo...
    next();
  } catch {
    return res.status(401).json({ ok: false, msg: "Token inválido" });
  }
};
