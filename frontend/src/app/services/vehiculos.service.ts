import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Vehiculo } from "../models/vehiculo";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class VehiculosService {
  private URL = "http://localhost:5000/api/vehiculos/";

  constructor(private http: HttpClient) {}
listarVehiculos() : Observable<Vehiculo[]>{
  return this.http.get<Vehiculo[]>(this.URL);
}

  crearVehiculo(dato: any) {
    return this.http.post(this.URL, dato);
  }

  borrarVehiculo(id: string) {
    return this.http.delete(this.URL + id);
  }
}
