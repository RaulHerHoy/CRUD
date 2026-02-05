import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carrito } from '../models/carrito';
import { Venta } from '../models/venta';

@Injectable({
  providedIn: 'root' // Servicio único en toda la app
})
export class VentasService {

  // URL base del backend para las ventas
  private API = 'http://localhost:5000/api/ventas';

  constructor(private http: HttpClient) {}

  // =========================================
  // CREA UNA NUEVA VENTA (formalizar compra)
  // =========================================
  crearVenta(dto: Carrito): Observable<Venta> {
    // POST /api/ventas
    return this.http.post<Venta>(this.API, dto);
  }

  // =========================================
  // HISTORIAL DE COMPRAS DE UN USUARIO
  // =========================================
  obtenerMisCompras(usuarioId: string): Observable<Venta[]> {
    // GET /api/ventas/usuario/:id
    return this.http.get<Venta[]>(`${this.API}/usuario/${usuarioId}`);
  }

  // =========================================
  // TODAS LAS COMPRAS (ADMIN)
  // =========================================
  obtenerTodas(): Observable<Venta[]> {
    // GET /api/ventas
    return this.http.get<Venta[]>(this.API);
  }

  // =========================================
  // BORRAR UNA COMPRA (ADMIN)
  // =========================================
  borrarVenta(id: string): Observable<any> {
    // DELETE /api/ventas/:id
    return this.http.delete(`${this.API}/${id}`);
  }
}
