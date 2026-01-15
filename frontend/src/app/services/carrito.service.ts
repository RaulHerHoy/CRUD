import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type CarritoItem = {
  _id: string;
  marca: string;
  modelo: string;
  precio: number;
  imagen?: string;
  cantidad: number;
};

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private readonly STORAGE_KEY = 'carrito';

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private itemsSubject = new BehaviorSubject<CarritoItem[]>(this.load());
  items$ = this.itemsSubject.asObservable();

  // ======================
  // LOCAL STORAGE (SSR SAFE)
  // ======================

  private load(): CarritoItem[] {
    if (!this.isBrowser) return [];

    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as CarritoItem[];
    } catch {
      return [];
    }
  }

  private save(items: CarritoItem[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
    this.itemsSubject.next(items);
  }

  // ======================
  // MÉTODOS PÚBLICOS
  // ======================

  getItems(): CarritoItem[] {
    return this.itemsSubject.value;
  }

  add(
    vehiculo: {
      _id: string;
      marca: string;
      modelo: string;
      precio: number;
      imagen?: string;
    },
    cantidad: number = 1
  ): void {

    const items = [...this.getItems()];
    const existente = items.find(i => i._id === vehiculo._id);

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      items.push({ ...vehiculo, cantidad });
    }

    this.save(items);
  }

  removeOne(id: string): void {
    const items = [...this.getItems()];
    const index = items.findIndex(i => i._id === id);
    if (index === -1) return;

    items[index].cantidad--;
    if (items[index].cantidad <= 0) {
      items.splice(index, 1);
    }

    this.save(items);
  }

  removeAll(id: string): void {
    this.save(this.getItems().filter(i => i._id !== id));
  }

  clear(): void {
    this.save([]);
  }

  total(): number {
    return this.getItems()
      .reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  count(): number {
    return this.getItems()
      .reduce((count, item) => count + item.cantidad, 0);
  }
}
