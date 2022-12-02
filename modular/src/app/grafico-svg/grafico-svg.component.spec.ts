import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoSvgComponent } from './grafico-svg.component';

describe('GraficoSvgComponent', () => {
  let component: GraficoSvgComponent;
  let fixture: ComponentFixture<GraficoSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GraficoSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
