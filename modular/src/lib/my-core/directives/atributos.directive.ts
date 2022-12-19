/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ErrorMessagePipe } from '../pipes/cadenas.pipe';

@Directive({ selector: `[myWinConfirm]` })
export class WindowConfirmDirective {
  @Output('myWinConfirm') winConfirm: EventEmitter<any> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('myWinConfirmMessage') winConfirmMessage = '¿Seguro?';
  @HostBinding('class.pressed') isPressed: boolean = false;

  @HostListener('click', ['$event'])
  confirmFirst() {
    if (window.confirm(this.winConfirmMessage)) {
      this.winConfirm.emit(null);
    }
  }
  @HostListener('mousedown') hasPressed() { this.isPressed = true; }
  @HostListener('mouseup') hasReleased() { this.isPressed = false; }
}

@Directive({ selector: '[show]' })
export class ShowDirective {
  @HostBinding() hidden: boolean = false;
  @Input() set show(value: boolean) { this.hidden = !value; }
}

@Directive({ selector: '[focused]' })
export class FocusedDirective {
  @Input() set focused(value: boolean) { if(value) this.el.nativeElement.focus(); }
  constructor(private el: ElementRef) {
 }
}

@Directive({ selector: '[myShowErrors]' })
export class ShowErrorsDirective implements OnChanges {
  private pipe = new ErrorMessagePipe();

  @Input('myShowErrors') errors: any = undefined;
  @HostBinding('textContent') mensaje: string = '';
  @HostBinding('hidden') hidden: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.errors) {
      this.hidden = true;
      return;
    }
    this.mensaje =this.pipe.transform(this.errors);
    this.hidden = this.mensaje === '';
  }
}


export const DIRECTIVAS_ATRIBUTO = [WindowConfirmDirective, ShowDirective, ShowErrorsDirective, FocusedDirective, ]
