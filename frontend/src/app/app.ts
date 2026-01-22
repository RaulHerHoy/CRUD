import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from "./components/layout/layout";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
