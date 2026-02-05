import { VehiculoVenta } from './vehiculo-venta';

/**
 * Representa una venta completa registrada en el sistema
 * Incluye información del usuario y los productos comprados
 */
export class Venta {
  // ID único de la venta
  _id?: string;

  // ID del usuario que realizó la compra
  usuarioId?: string;

  // Información del usuario (nombre, email, etc.) - opcional si viene del backend
  usuario?: {
    _id?: string;
    nombre?: string;
    email?: string;
  };

  // Lista de vehículos comprados en esta venta
  lineas: VehiculoVenta[] = [];

  // Total de la venta
  total?: number;

  // Estado de la venta (CONFIRMADA, PENDIENTE, CANCELADA, etc.)
  estado?: string;

  // Fecha de creación de la venta
  createdAt?: Date | string;

  // Fecha de última actualización
  updatedAt?: Date | string;
}
