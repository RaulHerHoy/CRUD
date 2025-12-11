import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-categorias',
  standalone: true,
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias {

  // Lista de categorías de vehículos
  categorias = [
    'Berlina',
    'SUV',
    'Compacto',
    'Familiar',
    'Deportivo',
    'Clásico'
  ];

  // Evento para comunicar al componente padre la categoría elegida
  @Output() seleccionarCategoria = new EventEmitter<string>();

  seleccionar(cat: string) {
    this.seleccionarCategoria.emit(cat);
  }
}
