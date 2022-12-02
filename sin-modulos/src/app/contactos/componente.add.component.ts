import { Component, OnInit, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormButtonsComponent } from '../components';
import { ShowDirective, ShowErrorsDirective } from '../directives';
import { ContactosViewModelService } from './servicios.service';

@Component({
  selector: 'app-contactos-add',
  standalone: true,
  imports: [FormsModule, ShowDirective, ShowErrorsDirective, FormButtonsComponent ],
  templateUrl: './tmpl-form.component.html',
  styleUrls: ['./componente.component.css']
})
export class ContactosAddComponent implements OnInit {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void {
    this.VM.add();
  }
}
