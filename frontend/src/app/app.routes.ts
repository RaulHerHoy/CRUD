import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { Vehiculos } from './components/vehiculos/vehiculos';
import { MisCompras } from './components/mis-compras/mis-compras';

export const routes: Routes = [
  { path: '', component: Vehiculos },           // Home / tienda
  { path: 'login', component: Login },           // Login
  { path: 'registro', component: Registro },     // Registro
  { path: 'mis-compras', component: MisCompras },// ✅ Historial de compras
  { path: '**', redirectTo: '' }                 // Cualquier otra → home
];
