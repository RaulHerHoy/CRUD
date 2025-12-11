import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtenemos el token del localStorage
  const token = localStorage.getItem('token');

  // Si hay token, clonamos la petición y añadimos el header Authorization
  if (token) {
    const reqClone = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(reqClone);
  }

  // Si no hay token enviamos la petición tal cual
  return next(req);
};
