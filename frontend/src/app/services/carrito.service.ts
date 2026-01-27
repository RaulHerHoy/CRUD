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

  // ✅ ahora el carrito se guarda por usuario: carrito_<userId>
  private readonly STORAGE_PREFIX = 'carrito_';
  private storageKey = this.STORAGE_PREFIX + 'anon';

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private itemsSubject = new BehaviorSubject<CarritoItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor() {
    // Carga inicial (anon)
    this.loadAndEmit();
  }

  /**
   * ✅ Llamar al arrancar la app (recarga F5) y también tras login
   * Cambia la clave del localStorage y carga el carrito correspondiente.
   */
  setUser(userId: string | null): void {
    this.storageKey = this.STORAGE_PREFIX + (userId ?? 'anon');
    this.loadAndEmit();
  }

  /**
   * ✅ Llamar SOLO cuando el login es correcto.
   * Deja el carrito vacío siempre que se hace login.
   */
  resetForLogin(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.storageKey);
    this.itemsSubject.next([]);
  }

  private load(): CarritoItem[] {
    if (!this.isBrowser) return [];

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as CarritoItem[];
    } catch {
      return [];
    }
  }

  private loadAndEmit(): void {
    const items = this.load();
    this.itemsSubject.next(items);
  }

  private save(items: CarritoItem[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
    this.itemsSubject.next(items);
  }

  getItems(): CarritoItem[] {
    return this.itemsSubject.value;
  }

  add(
    vehiculo: { _id: string; marca: string; modelo: string; precio: number; imagen?: string },
    cantidad: number = 1
  ): void {
    const items = [...this.getItems()];
    const existente = items.find(i => i._id === vehiculo._id);

    if (existente) existente.cantidad += cantidad;
    else items.push({ ...vehiculo, cantidad });

    this.save(items);
  }

  removeOne(id: string): void {
    const items = [...this.getItems()];
    const index = items.findIndex(i => i._id === id);
    if (index === -1) return;

    items[index].cantidad--;
    if (items[index].cantidad <= 0) items.splice(index, 1);

    this.save(items);
  }

  removeAll(id: string): void {
    this.save(this.getItems().filter(i => i._id !== id));
  }

  clear(): void {
    this.save([]);
  }

  total(): number {
    return this.getItems().reduce((t, item) => t + item.precio * item.cantidad, 0);
  }

  count(): number {
    return this.getItems().reduce((c, item) => c + item.cantidad, 0);
  }
}
