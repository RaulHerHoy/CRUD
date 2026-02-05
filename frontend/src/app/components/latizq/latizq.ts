// Importa Component para definir el componente
import { Component, Output, EventEmitter } from '@angular/core';

// Importa el componente Categorias
import { Categorias } from '../categorias/categorias';

@Component({
  selector: 'app-latizq',
  standalone: true,
  imports: [Categorias],
  templateUrl: './latizq.html',
  styleUrl: './latizq.css'
})
export class Latizq {

  // Emite la categoría seleccionada hacia el layout
  @Output() seleccionarCategoria = new EventEmitter<string | null>();

  // Recibe la selección de categoría desde el componente hijo (categorias)
  // y la reemite hacia arriba (al layout)
  onSeleccionarCategoria(categoria: string | null) {
    this.seleccionarCategoria.emit(categoria);
  }
}
