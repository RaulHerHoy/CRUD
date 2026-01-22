// Middleware de autenticación desactivado
// En esta versión del proyecto no se utilizan tokens JWT
// La sesión se gestiona desde el frontend mediante LocalStorage

module.exports = function authJWT(req, res, next) {
  // Permite pasar siempre a la siguiente función
  next();
};
