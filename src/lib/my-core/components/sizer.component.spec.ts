import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SizerComponent } from './sizer.component';

describe('SizerComponent', () => {
  let component: SizerComponent;
  let fixture: ComponentFixture<SizerComponent>
  let btnUp: HTMLButtonElement
  let btnDown: HTMLButtonElement
  let label : HTMLLabelElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const dom: HTMLElement = fixture.debugElement.nativeElement;
    btnDown = dom.querySelectorAll('button')[0]!;
    btnUp = dom.querySelectorAll('button')[1]!;
    label = dom.querySelector('label')!;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sube', () => {
    btnUp.click()
    fixture.detectChanges()
    expect(label.textContent).toBe('FontSize: 13px');
  });

  it('baja', () => {
    btnDown.click()
    fixture.detectChanges()
    expect(label.textContent).toBe('FontSize: 11px');
  });
});
