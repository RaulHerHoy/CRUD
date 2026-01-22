// Importa Injectable para poder inyectar este servicio en la app
import { Injectable } from "@angular/core";

// Importa HttpClient para hacer peticiones HTTP al backend
import { HttpClient } from "@angular/common/http";

// Importa Observable para manejar respuestas asíncronas
import { Observable } from "rxjs";

// Importa el modelo Vehiculo
import { Vehiculo } from "../models/vehiculo";

@Injectable({
  providedIn: "root", // Servicio único en toda la aplicación
})
export class VehiculosService {

  // URL base del backend para vehículos
  private URL = "http://localhost:5000/api/vehiculos/";

  // Inyecta HttpClient para poder usar GET / POST / PUT / DELETE
  constructor(private http: HttpClient) {}

  // =========================
  // OBTENER TODOS LOS VEHÍCULOS
  // =========================
  listarVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.URL);
  }

  // =========================
  // CREAR UN VEHÍCULO NUEVO
  // =========================
  crearVehiculo(data: Partial<Vehiculo>): Observable<any> {
    return this.http.post(this.URL, data);
  }

  // =========================
  // ACTUALIZAR UN VEHÍCULO EXISTENTE
  // =========================
  actualizarVehiculo(id: string, data: Partial<Vehiculo>): Observable<any> {
    return this.http.put(this.URL + id, data);
  }

  // =========================
  // ELIMINAR UN VEHÍCULO POR ID
  // =========================
  eliminarVehiculo(id: string): Observable<any> {
    return this.http.delete(this.URL + id);
  }


}
