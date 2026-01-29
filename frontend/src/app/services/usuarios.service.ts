// Importa Injectable para poder inyectar este servicio en cualquier componente
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";

// Importa el CarritoService (misma carpeta services)
import { CarritoService } from "./carrito.service";

// Importa isPlatformBrowser para saber si el código se ejecuta en navegador (no SSR/Node)
import { isPlatformBrowser } from "@angular/common";

// Importa HttpClient para hacer peticiones al backend
import { HttpClient } from "@angular/common/http";

// Importa el tipo Usuario (modelo) que usas en tu proyecto
import { Usuario } from "../models/usuario";

@Injectable({
  providedIn: "root",
})
export class UsuariosService {

  private URL = "http://localhost:5000/api/auth/";

  private USER_KEY = "usuario";
  private LOGGED_KEY = "isLogged";

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private carrito: CarritoService
  ) {}

  private esNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // ----------------------------
  // PETICIONES AL BACKEND
  // ----------------------------

  registrar(usuario: Usuario) {
    return this.http.post(this.URL + "registro", usuario);
  }

  login(email: string, password: string) {
    return this.http.post<any>(this.URL + "login", { email, password });
  }

  // ----------------------------
  // GESTIÓN DE SESIÓN (LocalStorage)
  // ----------------------------

  // ✅ Se llama SOLO cuando el login es correcto
  guardarUsuario(usuario: any) {
    if (!this.esNavegador()) return;

    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    localStorage.setItem(this.LOGGED_KEY, "true");

    // ✅ engancha carrito al usuario y lo deja SIEMPRE vacío al logear
    const userId = usuario?._id ?? usuario?.id ?? usuario?.email ?? null;
    this.carrito.setUser(userId);
    this.carrito.resetForLogin();
  }

  obtenerUsuario(): any | null {
    if (!this.esNavegador()) return null;

    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;

    return JSON.parse(raw);
  }

  estaLogueado(): boolean {
    if (!this.esNavegador()) return false;
    return localStorage.getItem(this.LOGGED_KEY) === "true";
  }

  logout() {
    if (!this.esNavegador()) return;

    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.LOGGED_KEY);

    // ✅ al salir: vuelve a "anon" y vacía (evita restos del usuario anterior)
    this.carrito.setUser(null);
    this.carrito.resetForLogin();
  }
}
