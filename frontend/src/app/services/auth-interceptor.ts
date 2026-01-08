import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  const platformId = inject(PLATFORM_ID);

  let token: string | null = null;

  // ✅ SOLO en navegador
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token');
  }

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
