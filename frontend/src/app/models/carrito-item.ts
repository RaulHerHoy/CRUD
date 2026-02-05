/**
 * Representa un item dentro del carrito de compras
 * Contiene toda la información necesaria para mostrar el producto en la UI del carrito
 */
export class CarritoItem {
  _id: string = '';

  marca: string = '';

  modelo: string = '';

  precio: number = 0;

  // URL de imagen (opcional)
  imagen?: string;

  // Cantidad de ese vehículo dentro del carrito
  cantidad: number = 1;
}
