// Importa Component y EventEmitter para emitir la categoría seleccionada
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
// Importa CommonModule para *ngFor y *ngIf
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { VehiculosService } from "../../services/vehiculos.service";

@Component({
  selector: "app-categorias",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./categorias.html",
  styleUrl: "./categorias.css",
})
export class Categorias implements OnInit, OnDestroy {

  // Lista de categorías que se mostrará en botones
  categorias: string[] = [];

  // Emite la categoría elegida al padre (Layout)
  @Output() seleccionarCategoria = new EventEmitter<string | null>();

  // Para guardar la suscripción y poder cerrarla
  private sub?: Subscription;

  constructor(private vehiculosService: VehiculosService) {}

  ngOnInit(): void {
    // Carga categorías al iniciar
    this.cargarCategorias();

    // Se suscribe al “avisador” para recargar categorías cuando el admin cambie vehículos
    this.sub = this.vehiculosService.categoriasChanged$.subscribe(() => {
      this.cargarCategorias();
    });
  }

  ngOnDestroy(): void {
    // Limpia la suscripción para evitar fugas de memoria
    this.sub?.unsubscribe();
  }

  // Pide las categorías al backend
  cargarCategorias(): void {
    this.vehiculosService.obtenerCategorias().subscribe({
      next: (res) => {
        // Guarda las categorías recibidas
        this.categorias = res || [];
      },
      error: () => {
        // Si falla, deja el array vacío
        this.categorias = [];
      },
    });
  }

  // Emite la categoría seleccionada
  seleccionar(cat: string): void {
    this.seleccionarCategoria.emit(cat);
  }

  // Quita filtro
  limpiarFiltro(): void {
    this.seleccionarCategoria.emit(null);
  }
}
