import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class VehiculosService {
  private URL = "http://localhost:5000/api/vehiculos/";

  constructor(private http: HttpClient) {}

  listarVehiculos() {
    return this.http.get(this.URL);
  }

  crearVehiculo(dato: any) {
    return this.http.post(this.URL, dato);
  }

  borrarVehiculo(id: string) {
    return this.http.delete(this.URL + id);
  }
}
