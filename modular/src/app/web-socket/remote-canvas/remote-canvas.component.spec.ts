import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteCanvasComponent } from './remote-canvas.component';

describe('RemoteCanvasComponent', () => {
  let component: RemoteCanvasComponent;
  let fixture: ComponentFixture<RemoteCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoteCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoteCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
