import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormButtonsComponent } from '../components';
import { ShowDirective, ShowErrorsDirective } from '../directives';
import { ContactosViewModelService } from './servicios.service';

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
