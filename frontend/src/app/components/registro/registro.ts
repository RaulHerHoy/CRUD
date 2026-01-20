import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  nombre = '';
  email = '';
  password = '';
  mensaje = '';
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  registrar() {
    this.mensaje = '';
    this.error = '';

    this.http.post<any>('http://localhost:5000/api/auth/registro', {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.mensaje = 'Usuario registrado correctamente';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: () => {
        this.error = 'No se pudo registrar el usuario';
      }
    });
  }
}
