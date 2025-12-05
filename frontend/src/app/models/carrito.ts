export class Carrito {
  _id?: string;
  usuarioId: string = "";
  items: {
    vehiculoId: string;
    cantidad: number;
  }[] = [];
}
