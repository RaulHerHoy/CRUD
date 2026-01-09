import { Component } from '@angular/core';
import { Categorias } from '../categorias/categorias';
import { Vehiculos } from '../vehiculos/vehiculos';
import { Carrito } from '../carrito/carrito';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterLink,
    Categorias,
    Vehiculos,
    Carrito
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {
  currentYear = new Date().getFullYear();

categoriaSeleccionada: string | null = null;

filtrarporcategoria(cat: string | null) {
  this.categoriaSeleccionada = cat;
  console.log("Categoría seleccionada:", cat);
}

  borrarFiltros() {
    this.categoriaSeleccionada = null;
  }
}

