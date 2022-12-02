import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactosViewModelService } from './servicios.service';
import { PaginatorModule } from 'primeng/paginator';

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

