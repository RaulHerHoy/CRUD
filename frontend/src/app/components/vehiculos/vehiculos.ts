import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculosService } from '../../services/vehiculos.service';
import { Vehiculo } from '../../models/vehiculo';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehiculos.html',
  styleUrl: './vehiculos.css'
})
export class Vehiculos implements OnInit, OnChanges {

  vehiculos: Vehiculo[] = [];
  vehiculosFiltrados: Vehiculo[] = [];

  @Input() categoriaSeleccionada: string | null = null;

  constructor(
    private vehiculoServ: VehiculosService,
    private carrito: CarritoService   // ✅ AÑADIDO
  ) {}

  ngOnInit() {
    this.vehiculoServ.listarVehiculos().subscribe({
      next: (res) => {
        this.vehiculos = res;
        this.vehiculosFiltrados = res;
        this.aplicarFiltro(); // ✅ por si ya había filtro
      },
      error: (err) => console.error(err)
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

  // ✅ BOTÓN "Añadir al carrito" usará esto
  addToCart(v: Vehiculo) {
    this.carrito.add({
      _id: v._id as string,
      marca: v.marca,
      modelo: v.modelo,
      precio: v.precio,
      imagen: v.imagen
    });
  }
}
