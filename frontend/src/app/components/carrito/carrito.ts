import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { CarritoService, CarritoItem } from '../../services/carrito.service';
import { VentasService, LineaVentaDTO } from '../../services/ventas.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnDestroy {

  items: CarritoItem[] = [];
  private sub: Subscription;

  constructor(
    public carrito: CarritoService,
    private ventas: VentasService
  ) {
    this.sub = this.carrito.items$.subscribe((items: CarritoItem[]) => {
      this.items = items;
    });
  }

  quitarUno(id: string): void { this.carrito.removeOne(id); }
  quitarTodo(id: string): void { this.carrito.removeAll(id); }
  vaciar(): void { this.carrito.clear(); }

  total(): number { return this.carrito.total(); }
  count(): number { return this.carrito.count(); }

  formalizarCompra(): void {
    if (this.items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const lineas: LineaVentaDTO[] = this.items.map(item => ({
      vehiculoId: item._id,
      titulo: `${item.marca} ${item.modelo}`,
      precio: item.precio,
      cantidad: item.cantidad
    }));

    this.ventas.crearVenta({ lineas }).subscribe({
      next: () => {
        alert('Compra realizada correctamente ✅');
        this.carrito.clear();
      },
      error: () => alert('Error al formalizar la compra ❌')
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
