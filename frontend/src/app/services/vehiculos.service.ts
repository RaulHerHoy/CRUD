import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
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
  crearVehiculo(vehiculo: Vehiculo) {
    return this.http.post(this.URL, vehiculo);
  }

  // Borra un vehículo por id
  eliminarVehiculo(id: string) {
    return this.http.delete(this.URL + id);
  }
  
  // Actualizar vehiculo datos e id
  actualizarVehiculo(id: string, vehiculo: Vehiculo) {
    return this.http.put(this.URL + id, vehiculo);
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
