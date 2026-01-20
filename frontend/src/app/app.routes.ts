import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { Vehiculos } from './components/vehiculos/vehiculos';

export const routes: Routes = [
  { path: '', component: Vehiculos },      // ✅ tienda
  { path: 'login', component: Login },  // ✅ login
  { path: 'registro', component: Registro }, // ✅ registro
  { path: '**', redirectTo: '' }
];
