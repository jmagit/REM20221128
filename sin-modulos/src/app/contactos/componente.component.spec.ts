import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationService, LoggerService } from '../services';
import { ContactosComponent } from './componente.host.component';

describe('ContactosComponent', () => {
  let component: ContactosComponent;
  let fixture: ComponentFixture<ContactosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ NotificationService, LoggerService ],
      imports: [ HttpClientTestingModule, RouterTestingModule, ContactosComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
