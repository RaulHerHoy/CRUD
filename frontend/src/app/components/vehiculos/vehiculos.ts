import { Component, Input, OnChanges, OnInit } from '@angular/core';
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
  this.vehiculoServ.listarVehiculos().subscribe({
    next: (res)=>{
    
   
   
    this.vehiculos = res;
    this.vehiculosFiltrados = res; 
    
  },
  error: (err)=> console.error(err)
});
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
