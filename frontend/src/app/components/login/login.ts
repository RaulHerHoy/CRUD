// Importa Component para definir el componente
import { Component } from '@angular/core';

// Importa CommonModule y FormsModule para usar *ngIf, ngModel, etc.
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importa Router para navegar (redirigir)
import { Router } from '@angular/router';

// Importa el servicio único de usuarios/sesión
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-login',               // Selector del componente
  standalone: true,                    // Componente standalone
  imports: [CommonModule, FormsModule],// Módulos necesarios
  templateUrl: './login.html',         // Template HTML
  styleUrl: './login.css'              // Estilos CSS
})
export class Login {

  // Campos del formulario
  email = '';                          // Email introducido por el usuario
  password = '';                       // Contraseña introducida por el usuario

  // Variables para controlar la UI
  loading = false;                     // Indica si está cargando (para desactivar botón)
  errorMsg = '';                       // Mensaje de error a mostrar

  // Inyecta el servicio de usuarios y el router
  constructor(
    private usuarios: UsuariosService, // Servicio de login + LocalStorage
    private router: Router             // Para navegar a otras rutas
  ) {
    // Si ya está logueado, se manda al inicio y se evita volver a login
    if (this.usuarios.estaLogueado()) {
      this.router.navigateByUrl('/');
    }
  }

  // Se ejecuta al enviar el formulario
  submit(ev: Event) {
    // Evita recargar la página
    ev.preventDefault();

    // Limpia errores anteriores
    this.errorMsg = '';

    // Activa el estado de carga
    this.loading = true;

    // Llama al backend para hacer login
    this.usuarios.login(this.email, this.password).subscribe({
      next: (res) => {
        // Desactiva el estado de carga
        this.loading = false;

        // Si el backend devuelve un error en formato { error: "..." }
        if (res?.error) {
          this.errorMsg = res.error;
          return;
        }

        // Si el backend devuelve un error en formato { ok:false, msg:"..." }
        if (res?.ok === false) {
          this.errorMsg = res.msg || 'Login incorrecto';
          return;
        }

        // Caso correcto: si llega un usuario (aunque no venga ok)
        if (res?.usuario) {
          // Guarda usuario + bandera en LocalStorage
          this.usuarios.guardarUsuario(res.usuario);

          // Navega al inicio
          this.router.navigateByUrl('/');
          return;
        }

        // Si no viene usuario, mostramos error genérico
        this.errorMsg = res?.msg || 'Login incorrecto';
      },

      error: (err) => {
        // Desactiva el estado de carga
        this.loading = false;

        // Intenta leer mensaje del backend si existe
        this.errorMsg = err?.error?.msg || err?.error?.error || 'Servidor no disponible';
      }
    });
  }
}
