import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ContactosViewModelService } from './servicios.service';

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
