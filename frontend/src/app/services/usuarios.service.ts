import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { CarritoService } from "./carrito.service";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Usuario } from "../models/usuario";

@Injectable({
  // Hace que el servicio esté disponible globalmente en toda la app (singleton)
  providedIn: "root",
})
export class UsuariosService {

  // URL base del módulo de autenticación en el backend
  private URL = "http://localhost:5000/api/auth/";

  // Clave donde se guarda el usuario en localStorage
  private USER_KEY = "usuario";

  // Clave donde se guarda un flag simple de sesión en localStorage
  private LOGGED_KEY = "isLogged";

  constructor(
    // Inyecta HttpClient para poder hacer peticiones HTTP
    private http: HttpClient,

    // Inyecta el identificador de plataforma para detectar si estamos en navegador
    @Inject(PLATFORM_ID) private platformId: Object,

    // Inyecta CarritoService para sincronizar el carrito con el usuario logueado
    private carrito: CarritoService
  ) {}

  // Devuelve true si el código se está ejecutando en navegador
  // Sirve para evitar usar localStorage en SSR o entornos donde no existe window
  private esNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // ----------------------------
  // PETICIONES AL BACKEND
  // ----------------------------

  // Envía un POST al endpoint /registro con los datos del usuario
  // Devuelve el Observable de la petición para que el componente se suscriba
  registrar(usuario: Usuario) {
    return this.http.post(this.URL + "registro", usuario);
  }

  // Envía un POST al endpoint /login con email y password
  // Devuelve un Observable con la respuesta del backend (any)
  login(email: string, password: string) {
    return this.http.post<any>(this.URL + "login", { email, password });
  }

  // ----------------------------
  // GESTIÓN DE SESIÓN (LocalStorage)
  // ----------------------------

  // Se llama SOLO cuando el login es correcto
  // Guarda el usuario en localStorage y marca la sesión como iniciada
  guardarUsuario(usuario: Usuario) {
    // Si no estamos en navegador, no se guarda nada (evita errores por localStorage)
    if (!this.esNavegador()) return;

    // Guarda el usuario serializado en JSON
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));

    // Guarda un flag simple para indicar que está logueado
    localStorage.setItem(this.LOGGED_KEY, "true");

    // Obtiene un identificador de usuario para asociar el carrito a ese usuario
    const userId = usuario?._id ?? usuario?.email ?? null;

    // Cambia la clave interna del carrito al usuario actual
    this.carrito.setUser(userId);

    // Resetea el carrito al hacer login (lo deja vacío siempre)
    this.carrito.resetForLogin();
  }

  // Recupera el usuario guardado en localStorage
  // Devuelve el objeto parseado o null si no existe
  obtenerUsuario(): Usuario | null {
    // Si no estamos en navegador, no se puede leer localStorage
    if (!this.esNavegador()) return null;

    // Lee el string guardado
    const raw = localStorage.getItem(this.USER_KEY);

    // Si no hay usuario guardado, devuelve null
    if (!raw) return null;

    // Convierte JSON a objeto y lo devuelve
    return JSON.parse(raw) as Usuario;
  }

  // Indica si el usuario está logueado según el flag guardado en localStorage
  estaLogueado(): boolean {
    // Si no es navegador, asumimos no logueado
    if (!this.esNavegador()) return false;

    // Comprueba si el flag está exactamente en "true"
    return localStorage.getItem(this.LOGGED_KEY) === "true";
  }

  // Cierra sesión: borra datos del usuario y reinicia el carrito
  logout() {
    // Si no estamos en navegador, no se puede acceder a localStorage
    if (!this.esNavegador()) return;

    // Elimina el usuario guardado
    localStorage.removeItem(this.USER_KEY);

    // Elimina el flag de sesión
    localStorage.removeItem(this.LOGGED_KEY);

    // Vuelve a asociar el carrito al modo anónimo
    this.carrito.setUser(null);

    // Vacía el carrito al salir para evitar que queden restos del usuario anterior
    this.carrito.resetForLogin();
  }
}
