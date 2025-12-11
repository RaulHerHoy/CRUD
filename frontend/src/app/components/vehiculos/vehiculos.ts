import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculosService } from '../../services/vehiculos.service';
import { Vehiculo } from '../../models/vehiculo';
@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehiculos.html',
  styleUrl: './vehiculos.css'
})
export class Vehiculos implements OnChanges {

  vehiculos: Vehiculo[] = [];          // Lista completa desde el backend
  vehiculosFiltrados: Vehiculo[] = []; // Lista filtrada
  
  @Input() categoriaSeleccionada: string | null = null;

  constructor(private vehiculoServ: VehiculosService) {}

ngOnInit() {
  this.vehiculoServ.listarVehiculos().subscribe(res => {
    this.vehiculos = res;
    this.vehiculosFiltrados = res;
  });
  alert(this.vehiculos);
}

  ngOnChanges() {
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (!this.categoriaSeleccionada) {
      this.vehiculosFiltrados = this.vehiculos;
      return;
    }

    this.vehiculosFiltrados = this.vehiculos.filter(v =>
      v.categoria.toLowerCase() === this.categoriaSeleccionada!.toLowerCase()
    );
  }
}
