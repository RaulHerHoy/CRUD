import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export type LoginResponse = {
  ok: boolean;
  token?: string;
  usuario?: {
    _id: string;
    nombre: string;
    email: string;
    rol: string;
    tipo: string;
  };
  msg?: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ✅ AJUSTA ESTO A TU RUTA REAL
  // Si en server/index.js haces: app.use('/api/auth', require('./routes/auth.routes'))
  // entonces BASE = 'http://localhost:5000/api/auth'
  private BASE = 'http://localhost:5000/api/auth';

  private TOKEN_KEY = 'token';
  private USER_KEY = 'usuario';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.BASE}/login`, { email, password }).pipe(
      tap(res => {
        if (res?.ok && res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          if (res.usuario) localStorage.setItem(this.USER_KEY, JSON.stringify(res.usuario));
        }
      })
    );
  }

  registro(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE}/registro`, { nombre, email, password });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsuario(): any | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isLogged(): boolean {
    return !!this.getToken();
  }
}
