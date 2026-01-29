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

  // Lista de compras (usuario normal: suyas | admin: todas)
  compras: any[] = [];

  // Estados de UI
  loading = true;
  errorMsg = '';

  // Guarda el id de la venta actualmente abierta (acordeón)
  ventaAbiertaId: string | null = null;

  // Bandera para saber si el usuario es admin
  esAdmin = false;

  constructor(
    private ventas: VentasService,
    private usuarios: UsuariosService,
    private router: Router
  ) {
    // Al cargar el componente, cargamos el historial
    this.cargarHistorial();
  }

  // ==========================================
  // CARGA HISTORIAL (USER / ADMIN)
  // ==========================================
  cargarHistorial(): void {
    const usuario = this.usuarios.obtenerUsuario();

    // Si no hay usuario, no puede ver historial
    if (!usuario?._id) {
      this.router.navigateByUrl('/login');
      return;
    }

    // Determina si es admin
    this.esAdmin = usuario.rol === 'admin';

    this.loading = true;
    this.errorMsg = '';

    // ADMIN → todas las compras
    if (this.esAdmin) {
      this.ventas.obtenerTodas().subscribe({
        next: (data) => {
          this.compras = data || [];
          this.loading = false;
          this.ventaAbiertaId = null;
        },
        error: (err) => {
          console.error('ERROR TODAS LAS COMPRAS ', err);
          this.errorMsg = 'No se ha podido cargar el historial';
          this.loading = false;
        }
      });
      return;
    }

    // USUARIO NORMAL → solo sus compras
    this.ventas.obtenerMisCompras(usuario._id).subscribe({
      next: (data) => {
        this.compras = data || [];
        this.loading = false;
        this.ventaAbiertaId = null;
      },
      error: (err) => {
        console.error('ERROR MIS COMPRAS ', err);
        this.errorMsg = 'No se ha podido cargar el historial';
        this.loading = false;
      }
    });
  }

  // ==========================================
  // ACORDEÓN
  // ==========================================
  toggleVenta(id: string): void {
    this.ventaAbiertaId = (this.ventaAbiertaId === id) ? null : id;
  }

  estaAbierta(id: string): boolean {
    return this.ventaAbiertaId === id;
  }

  // Total de unidades de una venta
  unidades(venta: any): number {
    return (venta?.lineas || []).reduce(
      (acc: number, l: any) => acc + Number(l.cantidad || 0),
      0
    );
  }

  // ==========================================
  // SOLO ADMIN → BORRAR COMPRA
  // ==========================================
  borrarVenta(id: string): void {
    if (!this.esAdmin) return;

    const ok = confirm('¿Eliminar esta compra?');
    if (!ok) return;

    this.ventas.borrarVenta(id).subscribe({
      next: () => {
        alert('Compra eliminada ');
        this.cargarHistorial(); // recarga listado
      },
      error: (err) => {
        console.error('ERROR BORRANDO VENTA ', err);
        alert('No se pudo eliminar la compra ');
      }
    });
  }
}
