// Importa las herramientas necesarias para realizar pruebas unitarias en Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente LayoutComponent que se va a probar
import { LayoutComponent } from './layout';

// Describe el conjunto de pruebas asociado al componente LayoutComponent
describe('Layout', () => {

  // Variable que contendrá la instancia del componente
  let component: LayoutComponent;

  // Fixture que permite interactuar con el componente y su plantilla
  let fixture: ComponentFixture<LayoutComponent>;

  // Se ejecuta antes de cada prueba
  beforeEach(async () => {

    // Configura el módulo de pruebas de Angular
    // Se importa directamente el componente LayoutComponent
    await TestBed.configureTestingModule({
      imports: [LayoutComponent]
    })
    // Compila el componente y su plantilla
    .compileComponents();

    // Crea una instancia del componente LayoutComponent
    fixture = TestBed.createComponent(LayoutComponent);

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
