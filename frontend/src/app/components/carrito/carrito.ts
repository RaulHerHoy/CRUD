import { Component, OnDestroy } from '@angular/core';
// Importa CommonModule para usar directivas como *ngIf y *ngFor en el HTML
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CarritoService } from '../../services/carrito.service';
import { VentasService } from '../../services/ventas.service';
import { UsuariosService } from '../../services/usuarios.service';
import { CarritoItem } from '../../models/carrito-item';
import { VehiculoVenta } from '../../models/vehiculo-venta';
import { Carrito as CarritoDTO } from '../../models/carrito';

@Component({
  selector: 'app-carrito',            
  standalone: true,                   
  imports: [CommonModule],            
  templateUrl: './carrito.html',     
  styleUrl: './carrito.css'          
})
export class Carrito implements OnDestroy {

  // Lista de items del carrito (se mantiene actualizada con el observable)
  items: CarritoItem[] = [];

  // Suscripción al observable del carrito
  private sub: Subscription;

  constructor(
    public carrito: CarritoService,   // Servicio del carrito (localStorage)
    private ventas: VentasService,    // Servicio que crea la venta en backend
    private usuarios: UsuariosService // Servicio de sesión para obtener el usuario logueado
  ) {
    // Nos suscribimos al carrito para que la lista se actualice en tiempo real
    this.sub = this.carrito.items$.subscribe((items: CarritoItem[]) => {
      this.items = items;
    });
  }


  // Quita una unidad de un producto
  quitarUno(id: string): void {
    this.carrito.removeOne(id);
  }

  // Quita todas las unidades de un producto
  quitarTodo(id: string): void {
    this.carrito.removeAll(id);
  }

  // Vacía el carrito por completo
  vaciar(): void {
    this.carrito.clear();
  }

  // Calcula el total del carrito
  total(): number {
    return this.carrito.total();
  }

  // Calcula el número total de unidades en el carrito
  count(): number {
    return this.carrito.count();
  }

  // Formaliza la compra creando una venta en el backend
  formalizarCompra(): void {

    // Si no hay items, no se puede comprar
    if (this.items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Obtiene el usuario logueado desde LocalStorage
    const usuario = this.usuarios.obtenerUsuario();

    // Si no hay usuario, no permitimos formalizar (porque no sabríamos a quién asignar la venta)
    if (!usuario?._id) {
      alert('Debes iniciar sesión para formalizar la compra');
      return;
    }

    // Construye las líneas de venta a partir del carrito
    const lineas: VehiculoVenta[] = this.items.map(item => {
      const vehiculoVenta = new VehiculoVenta();
      vehiculoVenta.vehiculoId = item._id;
      vehiculoVenta.titulo = `${item.marca} ${item.modelo}`;
      vehiculoVenta.precio = item.precio;
      vehiculoVenta.cantidad = item.cantidad;
      return vehiculoVenta;
    });

    // Crea el objeto CarritoDTO para enviar al backend
    const carritoVenta = new CarritoDTO();
    carritoVenta.usuarioId = usuario._id;
    carritoVenta.lineas = lineas;

    // Envía la venta al backend
    this.ventas.crearVenta(carritoVenta).subscribe({
      next: () => {
        // Si la venta se crea bien, avisamos y vaciamos carrito
        alert('Compra realizada correctamente');
        this.carrito.clear();
      },
      error: (err) => {
        // Si hay error, mostramos uno genérico y dejamos el carrito como está
        console.error('ERROR FORMALIZAR COMPRA ', err);
        alert('Error al formalizar la compra ');
      }
    });
  }

  // Cuando el componente se destruye, cancelamos la suscripción para evitar fugas de memoria
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
