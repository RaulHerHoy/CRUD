// Importa Component para crear el componente
import { Component } from '@angular/core';

// Importa CommonModule para *ngIf, *ngFor, etc.
import { CommonModule } from '@angular/common';

// Importa Router para redirigir si no está logueado
import { Router } from '@angular/router';

// Importa VentasService para pedir el historial
import { VentasService } from '../../services/ventas.service';

// Importa UsuariosService para leer el usuario desde LocalStorage
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-compras.html',
  styleUrl: './mis-compras.css'
})
export class MisCompras {

  // Lista de compras del usuario
  compras: any[] = [];

  // Estados de UI
  loading = true;
  errorMsg = '';

  // Guarda el id de la venta actualmente abierta (acordeón)
  ventaAbiertaId: string | null = null;

  constructor(
    private ventas: VentasService,
    private usuarios: UsuariosService,
    private router: Router
  ) {
    // Al cargar el componente, cargamos el historial
    this.cargarHistorial();
  }

  // Carga el historial de compras del usuario logueado
  cargarHistorial(): void {
    const usuario = this.usuarios.obtenerUsuario();

    // Si no hay usuario, no puede ver historial
    if (!usuario?._id) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.ventas.obtenerMisCompras(usuario._id).subscribe({
      next: (data) => {
        this.compras = data || [];
        this.loading = false;

        // Al cargar, cerramos el acordeón
        this.ventaAbiertaId = null;
      },
      error: (err) => {
        console.error('ERROR MIS COMPRAS 👉', err);
        this.errorMsg = 'No se ha podido cargar el historial';
        this.loading = false;
      }
    });
  }

  // Abre/cierra una venta del acordeón
  toggleVenta(id: string): void {
    // Si está abierta, se cierra; si está cerrada, se abre
    this.ventaAbiertaId = (this.ventaAbiertaId === id) ? null : id;
  }

  // Devuelve true si una venta está abierta
  estaAbierta(id: string): boolean {
    return this.ventaAbiertaId === id;
  }

  // Total de unidades de una venta (sumatorio de cantidades)
  unidades(venta: any): number {
    return (venta?.lineas || []).reduce((acc: number, l: any) => acc + Number(l.cantidad || 0), 0);
  }
}
