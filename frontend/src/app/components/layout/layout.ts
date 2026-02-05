import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Latizq } from '../latizq/latizq';
import { Latder } from '../latder/latder';
import { Vehiculos } from '../vehiculos/vehiculos';
import { Footer } from '../footer/footer';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
// Importa CommonModule para usar *ngIf
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    Header,      
    Latizq,      
    Latder,      
    Vehiculos,   
    Footer,      
    RouterOutlet
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
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

  // Recibe la categoría seleccionada desde latizq (que la recibe de categorias)
  filtrarporcategoria(cat: string | null) {
    this.categoriaSeleccionada = cat;
  }

  // Cierra sesión (recibido desde el header)
  logout() {
    // Borra usuario + bandera del LocalStorage
    this.usuarios.logout();

    // Actualiza variables para que el HTML cambie inmediatamente
    this.actualizarSesion();

    // Navega al login
    this.router.navigateByUrl('/login');
  }
}
