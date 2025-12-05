import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Usuario } from "../models/usuario";

@Injectable({
  providedIn: "root",
})
export class UsuariosService {
  private URL = "http://localhost:5000/api/usuarios/";

  constructor(private http: HttpClient) {}

  registrar(usuario: Usuario) {
    return this.http.post(this.URL + "register", usuario);
  }

  login(email: string, password: string) {
    return this.http.post(this.URL + "login", { email, password });
  }

  guardarToken(token: string) {
    localStorage.setItem("token", token);
  }

  obtenerToken() {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem("token");
  }
}
