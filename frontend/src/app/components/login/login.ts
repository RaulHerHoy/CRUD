import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  login() {
    this.error = '';

    this.http.post<any>('http://localhost:5000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
     next: (res) => {
  // si tu backend devuelve "usuario"
  this.auth.handleLoginSuccess({ token: res.token, user: res.usuario });
},

      error: () => {
        this.error = 'Email o contraseña incorrectos';
      }
    });
  }
}
