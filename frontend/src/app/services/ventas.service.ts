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
  usuarioId?: string;       // ID del usuario (opcional, pero recomendado)
  lineas: LineaVentaDTO[];  // Lista de productos comprados
}

@Injectable({
  providedIn: 'root' // Servicio único en toda la app
})
export class VentasService {

  // URL base del backend para las ventas
  // (tu servidor Node está escuchando en el puerto 5000)
  private API = 'http://localhost:5000/api/ventas';

  // Inyecta HttpClient
  constructor(private http: HttpClient) {}

  // =========================================
  // CREA UNA NUEVA VENTA (formalizar compra)
  // =========================================
  crearVenta(dto: CrearVentaDTO): Observable<any> {
    // POST /api/ventas
    return this.http.post(this.API, dto);
  }

  // =========================================
  // OBTIENE EL HISTORIAL DE COMPRAS DE UN USUARIO
  // =========================================
  obtenerMisCompras(usuarioId: string): Observable<any[]> {
    // GET /api/ventas/usuario/:id
    return this.http.get<any[]>(`${this.API}/usuario/${usuarioId}`);
  }
}
