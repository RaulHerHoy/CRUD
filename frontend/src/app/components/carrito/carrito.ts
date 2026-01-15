import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService, CarritoItem } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito {
  items: CarritoItem[] = [];

  constructor(public carrito: CarritoService) {
    this.carrito.items$.subscribe(items => this.items = items);
  }

  quitarUno(id: string) { this.carrito.removeOne(id); }
  quitarTodo(id: string) { this.carrito.removeAll(id); }
  vaciar() { this.carrito.clear(); }

  total() { return this.carrito.total(); }
  count() { return this.carrito.count(); }
}
