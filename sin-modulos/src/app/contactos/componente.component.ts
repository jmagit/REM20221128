import { DatePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap, RouterLink } from '@angular/router';
import { FormButtonsComponent } from '../components';
import { ShowDirective, ShowErrorsDirective } from '../directives';
import { ContactosViewModelService } from './servicios.service';
import { PaginatorModule } from 'primeng/paginator';

/*
@Component({
  selector: 'app-contactos-list',
  standalone: true,
  imports: [],
  templateUrl: './tmpl-list.sin-rutas.component.html',
  styleUrls: ['./componente.component.css']
})
export class ContactosListComponent implements OnInit, OnDestroy {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void { }
  ngOnDestroy(): void {  }
}

@Component({
  selector: 'app-contactos-add',
  standalone: true,
  imports: [],
  templateUrl: './tmpl-form.component.html',
  styleUrls: ['./componente.component.css']
})
export class ContactosAddComponent implements OnInit {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void { }
}

@Component({
  selector: 'app-contactos-edit',
  standalone: true,
  imports: [],
  templateUrl: './tmpl-form.component.html',
  styleUrls: ['./componente.component.css']
})
export class ContactosEditComponent implements OnInit, OnDestroy {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void { }
  ngOnDestroy(): void { }
}

@Component({
  selector: 'app-contactos-view',
  standalone: true,
  imports: [],
  templateUrl: './tmpl-view.component.html',
  styleUrls: ['./componente.component.css']
})
export class ContactosViewComponent implements OnInit, OnDestroy {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void { }
  ngOnDestroy(): void { }
}
*/
/*
@Component({
  selector: 'app-contactos-list',
  standalone: true,
  imports: [ PaginatorModule, RouterLink, NgIf, NgForOf ],
  templateUrl: './tmpl-list.con-rutas.component.html',
  styleUrls: ['./componente.component.css']
})
export class ContactosListComponent implements OnInit {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void {
    //this.vm.list();
    this.vm.load();
  }
}

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

@Component({
  selector: 'app-contactos-edit',
  standalone: true,
  imports: [FormsModule, ShowDirective, ShowErrorsDirective, FormButtonsComponent ],
  templateUrl: './tmpl-form.component.html',
  styleUrls: ['./componente.component.css']
})
export class ContactosEditComponent implements OnInit, OnDestroy {
  private obs$: any;
  constructor(protected vm: ContactosViewModelService,
    protected route: ActivatedRoute, protected router: Router) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void {
    this.obs$ = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const id = params?.get('id') ?? '';
        if (id) {
          this.vm.edit(id);
        } else {
          this.router.navigate(['/404.html']);
        }
      });
  }
  ngOnDestroy(): void {
    this.obs$.unsubscribe();
  }
}

@Component({
  selector: 'app-contactos-view',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './tmpl-view.component.html',
  styleUrls: ['./componente.component.css']
})
export class ContactosViewComponent implements OnInit, OnDestroy {
  private obs$: any;
  constructor(protected vm: ContactosViewModelService,
    protected route: ActivatedRoute, protected router: Router) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void {
    this.obs$ = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const id = params?.get('id') ?? '';
        if (id) {
          this.vm.view(id);
        } else {
          this.router.navigate(['/404.html']);
        }
      });
  }
  ngOnDestroy(): void {
    this.obs$.unsubscribe();
  }
}

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

export const CONTACTOS_COMPONENTES = [
  ContactosComponent, ContactosListComponent, ContactosAddComponent,
  ContactosEditComponent, ContactosViewComponent,
];
*/
