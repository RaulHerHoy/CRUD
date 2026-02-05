// Importa Component para definir el componente
import { Component, Input, Output, EventEmitter } from '@angular/core';

// Importa RouterLink para navegación
import { RouterLink } from '@angular/router';

// Importa CommonModule para usar *ngIf
import { CommonModule } from '@angular/common';

// Importa el tipo Usuario del modelo
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  // Recibe si el usuario está logueado
  @Input() logeado = false;

  // Recibe los datos del usuario
  @Input() usuario: Usuario | null = null;

  // Emite evento cuando se hace click en logout
  @Output() cerrarSesion = new EventEmitter<void>();

  // Método que se ejecuta al hacer click en cerrar sesión
  logout() {
    this.cerrarSesion.emit();
  }
}
