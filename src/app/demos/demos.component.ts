import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unsubscribable } from 'rxjs';
import { NotificationService, NotificationType } from '../common-services';

@Component({
  selector: 'app-svg',
  template: `
    <svg>
      <g>
        <rect x="0" y="0" width="100" height="100" [attr.fill]="fillColor" (click)="changeColor()" />
        <text x="120" y="50">click the rectangle to change the fill color</text>
      </g>
    </svg>
  `
})
export class SvgComponent {
  fillColor = 'rgb(255, 0, 0)';

  changeColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    this.fillColor = `rgb(${r}, ${g}, ${b})`;
  }
}

@Component({
  selector: 'app-demos',
  templateUrl: './demos.component.html',
  styleUrls: ['./demos.component.css']
})
export class DemosComponent implements OnInit, OnDestroy {
  private nombre: string = 'mundo'
  public listado = [
    { id: 1, nombre: 'Madrid'},
    { id: 2, nombre: 'barcelona'},
    { id: 3, nombre: 'MURCIA'},
    { id: 4, nombre: 'ciudad Real'},
  ]
  idProvincia = 3
  fecha = '2022-01-01';

  public resultado: string | null = null;

  visible = true;
  estetica = { importante: true, error: false, urgente: true }

  fontSize = 24;

  constructor(public vm: NotificationService) { }

  get Nombre(): string { return this.nombre; }
  set Nombre(value: string) {
    if(value === this.nombre) return;
    this.nombre = value
  }

  public saluda(): void {
    this.resultado = `Hola ${this.Nombre}`
  }

  public despide(): void {
    this.resultado = `Adios ${this.Nombre}`
  }

  public di(algo: string): void {
    this.resultado = `Dice ${algo}`
  }

  cambia() {
    this.visible = !this.visible
    this.estetica.importante = !this.estetica.importante
    this.estetica.error = !this.estetica.error
  }

  calcula(a: number, b: number): number {
    return a + b;
  }

  add(provincia: string) {
    const id = this.listado.length + 1
    this.listado.push({id, nombre: provincia})
    this.idProvincia = id
  }

  idiomas = [
    { codigo: 'en-US', region: 'USA' },
    { codigo: 'es', region: 'España' },
    { codigo: 'pt', region: 'Portugal' },
  ];
  idioma = this.idiomas[0].codigo;
  calculos: any[] = [];
  valCalculadora = 666;

  ponResultado(origen: string, valor: any) {
    this.calculos.push({
      pos: this.calculos.length + 1,
      origen,
      valor
    });
  }

  private suscriptor: Unsubscribable | undefined;
  ngOnInit(): void {
    this.suscriptor = this.vm.Notificacion.subscribe(n => {
      if (n.Type !== NotificationType.error) { return; }
      window.alert(`Suscripcion: ${n.Message}`);
      this.vm.remove(this.vm.Listado.length - 1);
    });
  }
  ngOnDestroy(): void {
    if (this.suscriptor) {
      this.suscriptor.unsubscribe();
    }
  }
}
