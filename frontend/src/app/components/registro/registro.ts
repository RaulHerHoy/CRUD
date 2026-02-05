import { Component } from '@angular/core';
// Importa CommonModule para usar directivas comunes como *ngIf o *ngFor
import { CommonModule } from '@angular/common';
// Importa FormsModule para poder usar ngModel en el formulario
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
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

  constructor(
    private usuarios: UsuariosService,
    private router: Router
  ) {}

  // Método que se ejecuta al enviar el formulario de registro
  registrar() {

    // Limpia los mensajes anteriores
    this.mensaje = '';
    this.error = '';

    // Crea un nuevo usuario usando la clase Usuario
    const nuevoUsuario = new Usuario();
    nuevoUsuario.nombre = this.nombre;
    nuevoUsuario.email = this.email;
    nuevoUsuario.password = this.password;

    // Usa el servicio para registrar el usuario
    this.usuarios.registrar(nuevoUsuario).subscribe({

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
