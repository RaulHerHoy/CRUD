/**
 * Representa una línea de una venta (un vehículo comprado)
 * Este modelo se usa para persistir las ventas en el backend
 */
export class VehiculoVenta {
  
  vehiculoId: string = '';

  // Texto descriptivo (marca + modelo concatenados)
  titulo: string = '';

  // Precio unitario al momento de la compra
  precio: number = 0;

  
  cantidad: number = 1;
}
