import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias {

  categorias = [
    'Berlina',
    'SUV',
    'Compacto',
    'Familiar',
    'Deportivo',
    'Clásico'
  ];

  // 👇 cambia a string | null para poder limpiar
  @Output() seleccionarCategoria = new EventEmitter<string | null>();

  seleccionar(cat: string) {
    this.seleccionarCategoria.emit(cat);
  }

  limpiarFiltro() {
    this.seleccionarCategoria.emit(null);
  }
}


/*
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports:[CommonModule],
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
*/