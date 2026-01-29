// Importa las utilidades necesarias para realizar pruebas unitarias en Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente Carrito que se va a probar
import { Carrito } from './carrito';

// Describe el conjunto de pruebas asociadas al componente Carrito
describe('Carrito', () => {

  // Variable que contendrá la instancia del componente
  let component: Carrito;

  // Fixture que permite acceder al componente y a su plantilla
  let fixture: ComponentFixture<Carrito>;

  // Se ejecuta antes de cada prueba
  beforeEach(async () => {

    // Configura el módulo de pruebas de Angular
    // Se importa directamente el componente Carrito
    await TestBed.configureTestingModule({
      imports: [Carrito]
    })
    // Compila el componente y su plantilla
    .compileComponents();

    // Crea una instancia del componente Carrito para las pruebas
    fixture = TestBed.createComponent(Carrito);

    // Obtiene la instancia del componente desde el fixture
    component = fixture.componentInstance;

    // Ejecuta la detección de cambios inicial
    fixture.detectChanges();
  });

  // Prueba básica para comprobar que el componente se crea correctamente
  it('should create', () => {
    // Verifica que la instancia del componente existe
    expect(component).toBeTruthy();
  });
});
