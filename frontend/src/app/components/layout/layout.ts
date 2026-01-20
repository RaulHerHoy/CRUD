import { Component } from '@angular/core';
import { Categorias } from '../categorias/categorias';
import { Vehiculos } from '../vehiculos/vehiculos';
import { Carrito } from '../carrito/carrito';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    Categorias,
    Vehiculos,
    Carrito,
    RouterOutlet
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

