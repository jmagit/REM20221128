import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactosViewModelService } from './servicios.service';
import { ContactosAddComponent } from './componente.add.component';
import { ContactosEditComponent } from './componente.edit.component';
import { ContactosListComponent } from './componente.list.component';
import { ContactosViewComponent } from './componente.view.component';

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [ContactosListComponent, ContactosAddComponent, ContactosEditComponent, ContactosViewComponent,
    NgSwitch, NgSwitchCase, NgSwitchDefault, ],
  templateUrl: './tmpl-anfitrion.component.html',
  // providers: [ ContactosViewModelService ],
  styleUrls: ['./componente.component.css']
})
export class ContactosComponent implements OnInit, OnDestroy {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void {
    //this.vm.list();
    this.vm.load();
  }
  ngOnDestroy(): void {
    this.vm.clear()
  }
}
