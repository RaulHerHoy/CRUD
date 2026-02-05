import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Latder } from './latder';

describe('Latder', () => {
  let component: Latder;
  let fixture: ComponentFixture<Latder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Latder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Latder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
