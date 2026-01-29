// Importa Injectable para poder inyectar este servicio en cualquier componente
// Importa inject y PLATFORM_ID para detectar en qué plataforma se está ejecutando (navegador/servidor)
import { Injectable, inject, PLATFORM_ID } from '@angular/core';

// Importa isPlatformBrowser para comprobar si estamos en el navegador (y no en SSR)
import { isPlatformBrowser } from '@angular/common';

// Importa BehaviorSubject para mantener y emitir el estado del carrito en tiempo real
import { BehaviorSubject } from 'rxjs';

// Define el tipo de dato que representa un item dentro del carrito
export type CarritoItem = {
  // Id del vehículo
  _id: string;

  // Marca del vehículo
  marca: string;

  // Modelo del vehículo
  modelo: string;

  // Precio unitario del vehículo
  precio: number;

  // URL de imagen (opcional)
  imagen?: string;

  // Cantidad de ese vehículo dentro del carrito
  cantidad: number;
};

@Injectable({
  // Indica que Angular creará una única instancia global del servicio (singleton)
  providedIn: 'root'
})
export class CarritoService {

  // Prefijo para la clave del localStorage: permite guardar un carrito distinto por usuario
  private readonly STORAGE_PREFIX = 'carrito_';

  // Clave actual del localStorage que se usará (por defecto para anónimo)
  private storageKey = this.STORAGE_PREFIX + 'anon';

  // Obtiene el identificador de plataforma (sirve para detectar navegador/servidor)
  private platformId = inject(PLATFORM_ID);

  // Booleano que vale true si se está ejecutando en el navegador
  private isBrowser = isPlatformBrowser(this.platformId);

  // Subject que almacena el array de items del carrito y emite cambios a quien se suscriba
  private itemsSubject = new BehaviorSubject<CarritoItem[]>([]);

  // Observable público para que los componentes puedan suscribirse a los cambios del carrito
  items$ = this.itemsSubject.asObservable();

  constructor() {
    // Carga inicial del carrito (modo anónimo) y emite su contenido
    this.loadAndEmit();
  }

  /**
   * Llamar al arrancar la app (recarga F5) y también tras login.
   * Cambia la clave del localStorage y carga el carrito correspondiente a ese usuario.
   */
  setUser(userId: string | null): void {
    // Si userId es null, usa 'anon'; si no, usa el id real del usuario
    this.storageKey = this.STORAGE_PREFIX + (userId ?? 'anon');

    // Carga el carrito desde localStorage con la nueva clave y emite
    this.loadAndEmit();
  }

  /**
   * Llamar SOLO cuando el login es correcto.
   * Deja el carrito vacío siempre que se hace login.
   */
  resetForLogin(): void {
    // Si no estamos en el navegador, no existe localStorage, así que salimos
    if (!this.isBrowser) return;

    // Borra del localStorage el carrito asociado a la clave actual
    localStorage.removeItem(this.storageKey);

    // Emite un array vacío para que la UI se actualice
    this.itemsSubject.next([]);
  }

  // Carga el carrito desde localStorage y devuelve el array de items
  private load(): CarritoItem[] {
    // Si no es navegador, no se puede usar localStorage
    if (!this.isBrowser) return [];

    // Lee el valor guardado en localStorage (string JSON)
    const raw = localStorage.getItem(this.storageKey);

    // Si no hay nada guardado, devuelve carrito vacío
    if (!raw) return [];

    try {
      // Intenta convertir el JSON a array de CarritoItem
      return JSON.parse(raw) as CarritoItem[];
    } catch {
      // Si el JSON está corrupto o mal formado, devuelve carrito vacío
      return [];
    }
  }

  // Carga el carrito y emite el resultado por el BehaviorSubject
  private loadAndEmit(): void {
    // Obtiene los items desde localStorage
    const items = this.load();

    // Emite esos items para que se actualicen los componentes suscritos
    this.itemsSubject.next(items);
  }

  // Guarda el carrito en localStorage y emite el nuevo estado
  private save(items: CarritoItem[]): void {
    // Solo guarda en localStorage si estamos en el navegador
    if (this.isBrowser) {
      // Convierte el array a JSON y lo guarda con la clave actual
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    // Emite el nuevo array para refrescar la UI
    this.itemsSubject.next(items);
  }

  // Devuelve el estado actual del carrito (sin suscripción, lectura directa)
  getItems(): CarritoItem[] {
    // value contiene el último valor emitido por el BehaviorSubject
    return this.itemsSubject.value;
  }

  // Añade un vehículo al carrito (por defecto 1 unidad)
  add(
    // Objeto vehículo mínimo necesario para el carrito
    vehiculo: { _id: string; marca: string; modelo: string; precio: number; imagen?: string },

    // Cantidad a añadir (por defecto 1)
    cantidad: number = 1
  ): void {
    // Copia el array actual para no mutar directamente el estado
    const items = [...this.getItems()];

    // Busca si ya existe un item con ese _id
    const existente = items.find(i => i._id === vehiculo._id);

    // Si existe, suma la cantidad
    if (existente) existente.cantidad += cantidad;

    // Si no existe, lo añade al array con esa cantidad
    else items.push({ ...vehiculo, cantidad });

    // Guarda y emite el carrito actualizado
    this.save(items);
  }

  // Quita una unidad de un vehículo del carrito
  removeOne(id: string): void {
    // Copia el array actual para trabajar sobre una copia
    const items = [...this.getItems()];

    // Busca la posición del item por su id
    const index = items.findIndex(i => i._id === id);

    // Si no existe, no hace nada
    if (index === -1) return;

    // Resta una unidad
    items[index].cantidad--;

    // Si la cantidad llega a 0 o menos, elimina el item del carrito
    if (items[index].cantidad <= 0) items.splice(index, 1);

    // Guarda y emite el carrito actualizado
    this.save(items);
  }

  // Elimina completamente un vehículo del carrito (todas sus unidades)
  removeAll(id: string): void {
    // Filtra para dejar solo los items que NO tengan ese id y guarda
    this.save(this.getItems().filter(i => i._id !== id));
  }

  // Vacía el carrito completo
  clear(): void {
    // Guarda un array vacío y emite
    this.save([]);
  }

  // Calcula el total del carrito (precio * cantidad de cada item)
  total(): number {
    // Reduce acumula el total sumando precio*cantidad por cada item
    return this.getItems().reduce((t, item) => t + item.precio * item.cantidad, 0);
  }

  // Calcula el número total de unidades del carrito (suma de cantidades)
  count(): number {
    // Reduce acumula la cantidad total sumando item.cantidad
    return this.getItems().reduce((c, item) => c + item.cantidad, 0);
  }
}
