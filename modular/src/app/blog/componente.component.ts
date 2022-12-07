import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, ActivationStart, NavigationStart, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { EventBusService } from '../common-services';
import { BlogViewModelService } from './servicios.service';

@Component({
  selector: 'app-blog',
  templateUrl: './tmpl-anfitrion.component.html',
  // providers: [ BlogViewModelService ],
  styleUrls: ['./componente.component.css']
})
export class BlogComponent implements OnInit, OnDestroy {
  constructor(protected vm: BlogViewModelService) { }
  public get VM(): BlogViewModelService { return this.vm; }
  ngOnInit(): void {
    //this.vm.list();
    this.vm.load();
  }
  ngOnDestroy(): void {
    this.vm.clear()
  }
}
@Component({
  selector: 'app-blog-list',
  templateUrl: './tmpl-list.component.html',
  styleUrls: ['./componente.component.css']
})
export class BlogListComponent implements OnInit, OnDestroy {
  private obs$: any;
  private login$: any;
  private logout$: any;
  constructor(protected vm: BlogViewModelService, protected route: ActivatedRoute, protected router: Router, private eventBus: EventBusService) { }
  public get VM(): BlogViewModelService { return this.vm; }
  ngOnInit(): void {
    //this.vm.list();
    //   this.obs$ = this.router.events.pipe(
    //     filter(e => e instanceof NavigationEnd)
    //  ).subscribe(e => {
    //         this.vm.load()
    //     });
    this.vm.load();
    // this.obs$ = this.router.events.subscribe(
    //   e => {
    //     if (e instanceof NavigationStart)
    //       this.vm.load()
    //   });
    this.login$ = this.eventBus.on('login', () => {
      this.vm.load()
    })
    this.logout$ = this.eventBus.on('logout', () => {
      this.router.navigateByUrl('/')
    })
  }
  ngOnDestroy(): void {
    if (this.obs$) this.obs$.unsubscribe();
    if (this.login$) this.login$.unsubscribe();
    if (this.logout$) this.logout$.unsubscribe();
    this.vm.clear();
  }
}

@Component({
  selector: 'app-blog-add',
  templateUrl: './tmpl-form.component.html',
  styleUrls: ['./componente.component.css']
})
export class BlogAddComponent implements OnInit {
  constructor(protected vm: BlogViewModelService) { }
  public get VM(): BlogViewModelService { return this.vm; }
  ngOnInit(): void {
    this.VM.add();
  }
}

@Component({
  selector: 'app-blog-edit',
  templateUrl: './tmpl-form.component.html',
  styleUrls: ['./componente.component.css']
})
export class BlogEditComponent implements OnInit, OnDestroy {
  private obs$: any;
  constructor(protected vm: BlogViewModelService,
    protected route: ActivatedRoute, protected router: Router) { }
  public get VM(): BlogViewModelService { return this.vm; }
  ngOnInit(): void {
    this.obs$ = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const id = parseInt(params?.get('id') ?? '');
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
  selector: 'app-blog-view',
  templateUrl: './tmpl-view.component.html',
  styleUrls: ['./componente.component.css']
})
export class BlogViewComponent implements OnInit, OnDestroy {
  private obs$: any;
  constructor(protected vm: BlogViewModelService,
    protected route: ActivatedRoute, protected router: Router) { }
  public get VM(): BlogViewModelService { return this.vm; }
  ngOnInit(): void {
    this.obs$ = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const id = parseInt(params?.get('id') ?? '');
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

export const BLOG_COMPONENTES = [
  BlogComponent, BlogListComponent, BlogAddComponent,
  BlogEditComponent, BlogViewComponent,
];
