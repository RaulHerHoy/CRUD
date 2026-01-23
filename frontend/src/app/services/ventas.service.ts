// Importa Injectable para poder inyectar este servicio en toda la aplicación
import { Injectable } from '@angular/core';

// Importa HttpClient para hacer peticiones HTTP al backend
import { HttpClient } from '@angular/common/http';

// Importa Observable para trabajar con peticiones asíncronas
import { Observable } from 'rxjs';

// ==============================
// MODELOS / DTOs
// ==============================

// Representa una línea de una venta (un vehículo comprado)
export interface LineaVentaDTO {
  vehiculoId: string; // ID del vehículo comprado
  titulo: string;     // Texto descriptivo (marca + modelo)
  precio: number;     // Precio unitario
  cantidad: number;   // Cantidad comprada
}

// Datos necesarios para crear una venta
export interface CrearVentaDTO {
  usuarioId?: string;       // ID del usuario (opcional)
  lineas: LineaVentaDTO[];  // Lista de productos comprados
}

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
  crearVenta(dto: CrearVentaDTO): Observable<any> {
    // POST /api/ventas
    return this.http.post(this.API, dto);
  }

  // =========================================
  // HISTORIAL DE COMPRAS DE UN USUARIO
  // =========================================
  obtenerMisCompras(usuarioId: string): Observable<any[]> {
    // GET /api/ventas/usuario/:id
    return this.http.get<any[]>(`${this.API}/usuario/${usuarioId}`);
  }

  // =========================================
  // TODAS LAS COMPRAS (ADMIN)
  // =========================================
  obtenerTodas(): Observable<any[]> {
    // GET /api/ventas
    return this.http.get<any[]>(this.API);
  }

  // =========================================
  // BORRAR UNA COMPRA (ADMIN)
  // =========================================
  borrarVenta(id: string): Observable<any> {
    // DELETE /api/ventas/:id
    return this.http.delete(`${this.API}/${id}`);
  }
}
