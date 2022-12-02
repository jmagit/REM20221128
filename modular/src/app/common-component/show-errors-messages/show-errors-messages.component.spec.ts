import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowErrorsMessagesComponent } from './show-errors-messages.component';

describe('ShowErrorsMessagesComponent', () => {
  let component: ShowErrorsMessagesComponent;
  let fixture: ComponentFixture<ShowErrorsMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowErrorsMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowErrorsMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Sin errores', () => {
    component.errors = null
    component.ngOnChanges({});
    expect(component.hidden).toBeTruthy()
  });

  it('Con errores', () => {
    component.errors = {
      required: true,
      minlength: { requiredLength: 10 },
      maxlength: { requiredLength: 10 },
      pattern: true,
      email: true,
      min: { min: 10 },
      max: { max: 10 },
      simple: 'Mensaje simple',
      simpleConPunto: 'Mensaje simple.',
      complejo: { message : 'Mensaje contenido'},
      complejoConPunto: { message : 'Mensaje contenido.'}
    }
    component.ngOnChanges({});
    expect(component.mensaje).toBe('Es obligatorio. Como mínimo debe tener 10 caracteres. Como máximo debe tener 10 caracteres. El formato no es correcto. El formato no es correcto. El valor debe ser mayor o igual a 10. El valor debe ser inferior o igual a 10. Mensaje simple. Mensaje simple. Mensaje contenido. Mensaje contenido.');
    expect(component.hidden).toBeFalsy()
  });

});
