// Importa el decorador Component para definir un componente Angular
import { Component } from '@angular/core';

// Importa CommonModule para usar directivas comunes como *ngIf o *ngFor
import { CommonModule } from '@angular/common';

// Importa FormsModule para poder usar ngModel en el formulario
import { FormsModule } from '@angular/forms';

// Importa Router para poder navegar entre rutas de la aplicación
import { Router } from '@angular/router';

// Importa HttpClient para realizar peticiones HTTP al backend
import { HttpClient } from '@angular/common/http';

@Component({
  // Selector del componente, usado en el HTML para renderizarlo
  selector: 'app-registro',

  // Indica que el componente es standalone
  standalone: true,

  // Módulos que necesita este componente
  imports: [CommonModule, FormsModule],

  // Ruta del archivo HTML asociado al componente
  templateUrl: './registro.html',

  // Ruta del archivo CSS asociado al componente
  styleUrl: './registro.css'
})
export class Registro {

  // Variables enlazadas al formulario mediante ngModel
  nombre = '';
  email = '';
  password = '';

  // Variables para mostrar mensajes al usuario
  mensaje = '';
  error = '';

  // Constructor con inyección de dependencias
  constructor(
    // Cliente HTTP para comunicarse con la API
    private http: HttpClient,

    // Router para redirigir a otras vistas
    private router: Router
  ) {}

  // Método que se ejecuta al enviar el formulario de registro
  registrar() {

    // Limpia los mensajes anteriores
    this.mensaje = '';
    this.error = '';

    // Realiza una petición POST al backend para registrar un usuario
    this.http.post<any>('http://localhost:5000/api/auth/registro', {
      // Datos enviados en el cuerpo de la petición
      nombre: this.nombre,
      email: this.email,
      password: this.password
    }).subscribe({

      // Se ejecuta si la petición es correcta
      next: () => {
        // Muestra un mensaje de éxito
        this.mensaje = 'Usuario registrado correctamente';

        // Redirige al login tras 1 segundo
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },

      // Se ejecuta si ocurre un error en la petición
      error: () => {
        // Muestra un mensaje de error
        this.error = 'No se pudo registrar el usuario';
      }
    });
  }
}
