import { VehiculoVenta } from './vehiculo-venta';

/**
 * Datos necesarios para crear una venta (formalizar compra)
 * Contiene el ID del usuario y las líneas de la venta
 */
export class Carrito {
  // ID del usuario que realiza la compra (opcional para usuarios no logueados)
  usuarioId?: string;

  // Lista de vehículos comprados (líneas de la venta)
  lineas: VehiculoVenta[] = [];
}
