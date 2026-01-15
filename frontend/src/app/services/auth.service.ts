import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export type UsuarioAuth = {
  _id: string;
  nombre: string;
  email: string;
  tipo: 'normal' | 'premium' | 'vip';
  rol: 'buyer' | 'admin';
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API = 'http://localhost:5000/api/auth';
  private readonly TOKEN_KEY = 'token';

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private userSubject = new BehaviorSubject<UsuarioAuth | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // ======================
  // LOCAL STORAGE (SSR SAFE)
  // ======================

  private loadUser(): UsuarioAuth | null {
    if (!this.isBrowser) return null;

    const raw = localStorage.getItem('user');
    if (!raw) return null;

    try {
      return JSON.parse(raw) as UsuarioAuth;
    } catch {
      return null;
    }
  }

  private saveSession(token: string, user: UsuarioAuth): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.userSubject.next(user);
  }

  private clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
  }

  // ======================
  // AUTH
  // ======================

  login(email: string, password: string) {
    return this.http.post<any>(`${this.API}/login`, { email, password });
  }

  handleLoginSuccess(res: any): void {
    this.saveSession(res.token, res.user);
    this.router.navigate(['/']);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  // ======================
  // HELPERS
  // ======================

  isLogged(): boolean {
    return !!this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.rol === 'admin';
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): UsuarioAuth | null {
    return this.userSubject.value;
  }
}
