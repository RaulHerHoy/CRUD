// Importa Component, Input, OnChanges y OnInit para manejar el ciclo de vida del componente
import { Component, Input, OnChanges, OnInit } from '@angular/core';
// Importa CommonModule para usar directivas como *ngIf y *ngFor en el HTML
import { CommonModule } from '@angular/common';
import { VehiculosService } from '../../services/vehiculos.service';
import { Vehiculo } from '../../models/vehiculo';
import { CarritoService } from '../../services/carrito.service';
import { UsuariosService } from '../../services/usuarios.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-vehiculos',          
  standalone: true,                 
  imports: [CommonModule, FormsModule],          
  templateUrl: './vehiculos.html',    
  styleUrl: './vehiculos.css'        
})
export class Vehiculos implements OnInit, OnChanges {

  // Lista completa de vehículos traídos del backend
  vehiculos: Vehiculo[] = [];
  // Lista filtrada según la categoría seleccionada
  vehiculosFiltrados: Vehiculo[] = [];
  // Categoría recibida desde el Layout (Input)
  @Input() categoriaSeleccionada: string | null = null;
  // Bandera para saber si el usuario logueado es admin
  esAdmin = false;

  // -----------------------------
  // FORMULARIO SIMPLE PARA ADMIN
  // (crear/editar sin pantallas raras)
  // -----------------------------

  // Controla si estamos editando (true) o creando (false)
  modoEdicion = false;

  // Guarda el id del vehículo que se está editando
  editId: string | null = null;

  // Datos del formulario usando la clase Vehiculo
  form: Vehiculo = new Vehiculo();

  constructor(
    private vehiculoServ: VehiculosService,  
    private carrito: CarritoService,        
    private usuarios: UsuariosService       
  ) {}

  // Se ejecuta al iniciar el componente
  ngOnInit() {
    // Obtiene el usuario logueado desde LocalStorage
    const usuario = this.usuarios.obtenerUsuario();
    // Activa modo admin si el rol del usuario es "admin"
    this.esAdmin = usuario?.rol === 'admin';
    // Carga los vehículos desde el backend
    this.cargarVehiculos();
  }

  // Se ejecuta cuando cambia el Input (categoría)
  ngOnChanges() {
    this.aplicarFiltro();
  }

  // Carga la lista de vehículos del backend
  cargarVehiculos() {
    this.vehiculoServ.listarVehiculos().subscribe({
      next: (res) => {
        // Guarda la lista completa
        this.vehiculos = res;
        // Inicialmente, la lista filtrada es toda la lista
        this.vehiculosFiltrados = res;
        // Aplica filtro por si ya había una categoría seleccionada
        this.aplicarFiltro();
      },
      error: (err) => console.error(err)
    });
  }

  // Aplica filtro por categoría
  aplicarFiltro() {
    // Si no hay categoría, se muestran todos
    if (!this.categoriaSeleccionada) {
      this.vehiculosFiltrados = this.vehiculos;
      return;
    }

    // Filtra comparando categorías en minúsculas
    this.vehiculosFiltrados = this.vehiculos.filter(v =>
      v.categoria.toLowerCase() === this.categoriaSeleccionada!.toLowerCase()
    );
  }

  // Añade un vehículo al carrito
  addToCart(v: Vehiculo) {
    this.carrito.add({
      _id: v._id as string,
      marca: v.marca,
      modelo: v.modelo,
      precio: v.precio,
      imagen: v.imagen
    });
  }

  // -----------------------------
  // FUNCIONES ADMIN (CRUD)
  // -----------------------------

  // Prepara el formulario para crear un vehículo nuevo
  nuevoVehiculo() {
    // Solo admin puede usar esto
    if (!this.esAdmin) return;

    // Cambia a modo creación
    this.modoEdicion = false;
    this.editId = null;

    // Limpia el formulario creando un nuevo objeto Vehiculo
    this.form = new Vehiculo();
  }

  // Carga en el formulario los datos de un vehículo para editarlo
  editarVehiculo(v: Vehiculo) {
    // Solo admin puede usar esto
    if (!this.esAdmin) return;

    // Activa modo edición y guarda el id
    this.modoEdicion = true;
    this.editId = v._id as string;

    // Copia datos del vehículo al formulario
    this.form = new Vehiculo();
    this.form.marca = v.marca;
    this.form.modelo = v.modelo;
    this.form.precio = v.precio;
    this.form.categoria = v.categoria;
    this.form.imagen = v.imagen || '';
  }

  // Guarda (crea o actualiza) según el modo actual
  guardarVehiculo() {
    // Solo admin puede usar esto
    if (!this.esAdmin) return;

    // Validación mínima para no mandar basura
    if (!this.form.marca || !this.form.modelo || !this.form.categoria) {
      alert('Rellena marca, modelo y categoría');
      return;
    }

    // Si estamos editando, hacemos update
    if (this.modoEdicion && this.editId) {

      this.vehiculoServ.actualizarVehiculo(this.editId, this.form).subscribe({
        next: () => {
          alert('Vehículo actualizado ');
          this.cargarVehiculos();
          this.nuevoVehiculo(); // limpia formulario y vuelve a modo creación
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar ');
        }
      });

      return;
    }

    // Si no estamos editando, creamos uno nuevo
    this.vehiculoServ.crearVehiculo(this.form).subscribe({
      next: () => {
        alert('Vehículo creado ');
        this.cargarVehiculos();
        this.nuevoVehiculo(); // limpia el formulario
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear ');
      }
    });
  }

  // Elimina un vehículo por id
  eliminarVehiculo(id: string) {
    // Solo admin puede usar esto
    if (!this.esAdmin) return;

    // Confirmación para evitar borrados accidentales
    const ok = confirm('¿Eliminar este vehículo?');
    if (!ok) return;

    this.vehiculoServ.eliminarVehiculo(id).subscribe({
      next: () => {
        alert('Vehículo eliminado ');
        this.cargarVehiculos();
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar ');
      }
    });
  }
}
