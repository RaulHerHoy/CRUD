import { Component, Input } from '@angular/core';
// Importa CommonModule para *ngIf
import { CommonModule } from '@angular/common';
import { Carrito } from '../carrito/carrito';

@Component({
  selector: 'app-latder',
  standalone: true,
  imports: [CommonModule, Carrito],
  templateUrl: './latder.html',
  styleUrl: './latder.css'
})
export class Latder {

  // Recibe si el usuario está logueado
  @Input() logeado = false;
}
