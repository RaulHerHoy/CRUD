// Importa Injectable para poder inyectar este servicio en cualquier componente
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";

// Importa isPlatformBrowser para saber si el código se ejecuta en navegador (no SSR/Node)
import { isPlatformBrowser } from "@angular/common";

// Importa HttpClient para hacer peticiones al backend
import { HttpClient } from "@angular/common/http";

// Importa el tipo Usuario (modelo) que usas en tu proyecto
import { Usuario } from "../models/usuario";

@Injectable({
  providedIn: "root", // Hace que el servicio sea único en toda la aplicación
})
export class UsuariosService {

  // URL base del backend para autenticación (login y registro)
  // Usamos /api/auth porque es el endpoint que ya tienes funcionando sin JWT
  private URL = "http://localhost:5000/api/auth/";

  // Clave para guardar el usuario como JSON en LocalStorage
  private USER_KEY = "usuario";

  // Clave para guardar una bandera de sesión iniciada
  private LOGGED_KEY = "isLogged";

  // Inyecta HttpClient para llamadas HTTP
  // Inyecta PLATFORM_ID para poder comprobar si estamos en navegador
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Función auxiliar para saber si estamos en navegador (y existe localStorage)
  private esNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // ----------------------------
  // PETICIONES AL BACKEND
  // ----------------------------

  // Registra un nuevo usuario
  registrar(usuario: Usuario) {
    // Envía el usuario al endpoint /registro
    return this.http.post(this.URL + "registro", usuario);
  }

  // Hace login con email y password
  login(email: string, password: string) {
    // Envía credenciales al endpoint /login
    // Se espera que el backend devuelva algo como { ok: true, usuario: {...}, msg?: string }
    return this.http.post<any>(this.URL + "login", { email, password });
  }

  // ----------------------------
  // GESTIÓN DE SESIÓN (LocalStorage)
  // ----------------------------

  // Guarda el usuario y activa la bandera de sesión
  guardarUsuario(usuario: any) {
    // En SSR (Node) no existe localStorage, así que salimos
    if (!this.esNavegador()) return;

    // Guarda el usuario completo en LocalStorage (en formato JSON)
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));

    // Guarda la bandera que indica “sesión iniciada”
    localStorage.setItem(this.LOGGED_KEY, "true");
  }

  // Obtiene el usuario guardado en LocalStorage
  obtenerUsuario(): any | null {
    // Si no estamos en navegador, no se puede leer localStorage
    if (!this.esNavegador()) return null;

    // Lee el string guardado
    const raw = localStorage.getItem(this.USER_KEY);

    // Si no existe, no hay usuario logueado
    if (!raw) return null;

    // Convierte el JSON a objeto y lo devuelve
    return JSON.parse(raw);
  }

  // Devuelve true si el usuario está logueado
  estaLogueado(): boolean {
    // En SSR devolvemos false para evitar errores
    if (!this.esNavegador()) return false;

    // Comprueba la bandera de sesión
    return localStorage.getItem(this.LOGGED_KEY) === "true";
  }

  // Cierra sesión eliminando usuario y bandera
  logout() {
    // Si no estamos en navegador, no hacemos nada
    if (!this.esNavegador()) return;

    // Elimina usuario y bandera del LocalStorage
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.LOGGED_KEY);
  }
}
