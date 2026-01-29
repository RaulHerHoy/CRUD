// Importa las utilidades necesarias para realizar pruebas unitarias en Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente Registro que se va a probar
import { Registro } from './registro';

// Describe el conjunto de pruebas asociado al componente Registro
describe('Registro', () => {

  // Variable que contendrá la instancia del componente
  let component: Registro;

  // Fixture que permite interactuar con el componente y su plantilla
  let fixture: ComponentFixture<Registro>;

  // Se ejecuta antes de cada prueba
  beforeEach(async () => {

    // Configura el módulo de pruebas de Angular
    // Se importa directamente el componente Registro
    await TestBed.configureTestingModule({
      imports: [Registro]
    })
    // Compila el componente y su plantilla
    .compileComponents();

    // Crea una instancia del componente Registro
    fixture = TestBed.createComponent(Registro);

    // Obtiene la instancia del componente desde el fixture
    component = fixture.componentInstance;

    // Ejecuta la detección de cambios inicial
    fixture.detectChanges();
  });

  // Prueba básica para comprobar que el componente se crea correctamente
  it('should create', () => {
    // Verifica que el componente ha sido creado correctamente
    expect(component).toBeTruthy();
  });
});
