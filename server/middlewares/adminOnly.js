// Exporta una función middleware para proteger rutas solo para administradores
module.exports = function adminOnly(req, res, next) {

  // Comprueba si no existe req.user o si el rol del usuario no es "admin"
  // req.user normalmente se añade en un middleware previo de autenticación
  if (!req.user || req.user.rol !== "admin") {

    // Si no es administrador, devuelve un error 403 (prohibido)
    return res.status(403).json({
      ok: false,
      msg: "Solo admin"
    });
  }

  // Si el usuario existe y su rol es admin, permite continuar a la siguiente función
  next();
};
