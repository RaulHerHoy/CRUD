// Importa Injectable para poder inyectar este servicio en la app
import { Injectable } from '@angular/core';

// Importa HttpClient para hacer peticiones HTTP al backend
import { HttpClient } from '@angular/common/http';

// Importa Observable para manejar la respuesta de forma asíncrona
import { Observable } from 'rxjs';

// Estructura de una línea de venta (un producto dentro de la compra)
export interface LineaVentaDTO {
  vehiculoId: string; // Id del vehículo comprado
  titulo: string;     // Texto (marca + modelo) para mostrar o guardar
  precio: number;     // Precio unitario
  cantidad: number;   // Cantidad comprada
}

// Estructura del DTO para crear una venta
export interface CrearVentaDTO {
  usuarioId: string;        // Id del usuario que realiza la compra
  lineas: LineaVentaDTO[];  // Líneas considered
}

@Injectable({ providedIn: 'root' })
export class VentasService {

  // URL base del backend para ventas
  private API = 'http://localhost:5000/api/ventas';

  constructor(private http: HttpClient) {}

  // Crea una venta en el backend
  crearVenta(dto: CrearVentaDTO): Observable<any> {
    return this.http.post(this.API, dto);
  }

  // Obtiene el historial de compras de un usuario
  obtenerMisCompras(usuarioId: string): Observable<any[]> {
    // Llama a GET /api/ventas/usuario/:id
    return this.http.get<any[]>(`${this.API}/usuario/${usuarioId}`);
  }
}
