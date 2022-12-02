import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MyCoreModule } from '@my/core';
import { CommonServicesModule } from '../common-services';
import { BlogAddComponent, BlogEditComponent, BlogListComponent, BlogViewComponent, BLOG_COMPONENTES } from './componente.component';
import { PaginatorModule } from 'primeng/paginator';
import { CommonComponentModule } from '../common-component';
import {EditorModule} from 'primeng/editor';
import {InplaceModule} from 'primeng/inplace';
import { AuthGuard } from '../security';

const routes: Routes = [
  { path: 'blog', children: [
    { path: '', component: BlogListComponent },
    { path: 'add', component: BlogAddComponent, canActivate: [AuthGuard] },
    { path: ':id/edit', component: BlogEditComponent, canActivate: [AuthGuard] },
    { path: ':id', component: BlogViewComponent },
    { path: ':id/:kk', component: BlogViewComponent },
  ] },
]

@NgModule({
  declarations: [
    BLOG_COMPONENTES,
  ],
  exports: [
    BLOG_COMPONENTES,
  ],
  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), NgOptimizedImage,
    MyCoreModule, CommonServicesModule,
    PaginatorModule, CommonComponentModule, MyCoreModule,
    EditorModule, InplaceModule,
  ]
})
export class BlogModule { }
