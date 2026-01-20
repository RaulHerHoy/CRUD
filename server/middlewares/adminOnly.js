module.exports = function adminOnly(req, res, next) {
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({ ok: false, msg: "Solo admin" });
  }
  next();
};
