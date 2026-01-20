import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LineaVentaDTO {
  vehiculoId: string;
  titulo: string;
  precio: number;
  cantidad: number;
}

export interface CrearVentaDTO {
  userId?: string | null;
  lineas: LineaVentaDTO[];
}

@Injectable({ providedIn: 'root' })
export class VentasService {
  private API = 'http://localhost:3000/api/ventas'; // ajusta puerto/baseURL

  constructor(private http: HttpClient) {}

  crearVenta(dto: CrearVentaDTO): Observable<any> {
    return this.http.post(this.API, dto);
  }
}
