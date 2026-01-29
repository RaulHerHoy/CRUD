// Importa Component para definir el componente
import { Component } from '@angular/core';

// Importa componentes que se muestran en el layout
import { Categorias } from '../categorias/categorias';
import { Vehiculos } from '../vehiculos/vehiculos';
import { Carrito } from '../carrito/carrito';

// Importa RouterLink y RouterOutlet para navegación y render de rutas
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';

// Importa CommonModule para usar *ngIf, *ngFor, etc.
import { CommonModule } from '@angular/common';

// Importa el servicio de sesión (LocalStorage)
import { UsuariosService } from '../../services/usuarios.service';

// Importa el tipo Usuario del modelo
import { Usuario } from '../../models/usuario';

// Importa filter para filtrar eventos del router
import { filter } from 'rxjs';
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-layout',          // Selector del componente
  standalone: true,                // Componente standalone
  imports: [
    CommonModule, // Para directivas como *ngIf
    RouterLink, // Para routerLink
    Categorias, // Componente de categorías
    Vehiculos, // Componente de vehículos
    Carrito, // Componente del carrito
    RouterOutlet // Para mostrar login/registro u otras rutas
    ,
    Footer
],
  templateUrl: './layout.html',    // HTML del layout
  styleUrl: './layout.css'         // CSS del layout
})
export class LayoutComponent {



  // Categoría seleccionada para filtrar vehículos
  categoriaSeleccionada: string | null = null;

  // Usuario logueado (si existe)
  usuario: Usuario | null = null;

  // Bandera simple para saber si hay sesión iniciada
  logeado = false;

  // Bandera para saber si estamos en la ruta principal (home)
  // Si esHome es true → mostramos vehículos
  // Si esHome es false → mostramos router-outlet (login/registro)
  esHome = true;

  // Inyecta UsuariosService para sesión y Router para detectar ruta y navegar
  constructor(
    private usuarios: UsuariosService,
    private router: Router
  ) {
    // Al cargar el layout se actualiza sesión y se detecta la ruta actual
    this.actualizarSesion();
    this.actualizarEsHome();

    // Cada vez que cambie la ruta, actualizamos la sesión y si estamos en home
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.actualizarSesion();
        this.actualizarEsHome();
      });
  }

  // Lee LocalStorage a través del servicio y actualiza variables del layout
  actualizarSesion() {
    this.logeado = this.usuarios.estaLogueado();
    this.usuario = this.usuarios.obtenerUsuario();
  }

  // Detecta si la ruta actual es la home ("/")
  actualizarEsHome() {
    // Si la URL es "/" entonces estamos en home
    this.esHome = this.router.url === '/' || this.router.url.startsWith('/?');
  }

  // Recibe la categoría seleccionada desde el componente Categorias
  filtrarporcategoria(cat: string | null) {
    this.categoriaSeleccionada = cat;
  }

  // Limpia filtros (muestra todos los vehículos)
  borrarFiltros() {
    this.categoriaSeleccionada = null;
  }

  // Cierra sesión
  logout() {
    // Borra usuario + bandera del LocalStorage
    this.usuarios.logout();

    // Actualiza variables para que el HTML cambie inmediatamente
    this.actualizarSesion();

    // Navega al login
    this.router.navigateByUrl('/login');
  }
}
