import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  loading = false;
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit(ev: Event) {
    ev.preventDefault();
    this.errorMsg = '';
    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;

        if (!res.ok) {
          this.errorMsg = res.msg || 'Login incorrecto';
          return;
        }

        // ✅ si llega aquí, token guardado
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.loading = false;
        console.error('LOGIN ERROR 👉', err);
        this.errorMsg = err?.error?.msg || 'Servidor no disponible / URL incorrecta';
      }
    });
  }
}
