// Importa Injectable para poder inyectar este servicio en la app
import { Injectable } from "@angular/core";

// Importa HttpClient para hacer peticiones al backend
import { HttpClient } from "@angular/common/http";

// Importa Observable para tipar respuestas
import { Observable, Subject } from "rxjs";

// Importa el modelo Vehiculo
import { Vehiculo } from "../models/vehiculo";

@Injectable({
  providedIn: "root",
})
export class VehiculosService {

  // URL base del backend para vehículos
  private URL = "http://localhost:5000/api/vehiculos/";

  // Subject para avisar a otros componentes de que cambiaron las categorías
  private categoriasSubject = new Subject<void>();

  // Observable público para que Categorias se suscriba
  categoriasChanged$ = this.categoriasSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Devuelve todos los vehículos
  listarVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.URL);
  }

  // Crea un vehículo nuevo
  crearVehiculo(dato: any) {
    return this.http.post(this.URL, dato);
  }

  // Borra un vehículo por id
  borrarVehiculo(id: string) {
    return this.http.delete(this.URL + id);
  }

  // (Si en tu app usas eliminarVehiculo en vez de borrarVehiculo, NO lo borres)
  // Si NO existe, puedes añadir este alias para que no te rompa nada:
  eliminarVehiculo(id: string) {
    return this.borrarVehiculo(id);
  }

  // (Si ya tienes actualizarVehiculo en tu proyecto, déjalo tal cual)
  // Si NO existe y lo estás llamando en Vehiculos.ts, añádelo:
  actualizarVehiculo(id: string, dato: any) {
    return this.http.put(this.URL + id, dato);
  }

  // Obtener categorías únicas desde el backend
  obtenerCategorias(): Observable<string[]> {
    return this.http.get<string[]>(this.URL + "categorias");
  }

  // Lanza un aviso para que el componente Categorias recargue las categorías
  avisarCategoriasCambiadas(): void {
    this.categoriasSubject.next();
  }
}
