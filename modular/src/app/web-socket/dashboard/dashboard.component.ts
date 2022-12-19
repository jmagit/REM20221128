import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../web-socket.services';

@Injectable({
  providedIn: 'root'
})
export class DashboardWebSocketService extends WebSocketService {
  constructor() {
    super('dashboard')
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  simple: any;
  multiple: any;
  simpleOptions: any;
  multipleOptions: any;
  private subscription: Subscription | undefined

  constructor(private wss: DashboardWebSocketService) {
    this.multipleOptions = {
      // animation: false,
      defaults: {
        backgroundColor: '#9BD0F5',
        borderColor: '#36A2EB',
        color: '#000'
      },
      layout: {
        padding: 10
      },
      animation: { duration: 400 },
      animateRotate: true,
      // transitions: 'hide'
      // {
      //   active: { animation: { duration: 0 }}
      // }
    }
    this.simpleOptions = {
      animation: { duration: 100 },
      // tooltips: {
      //   mode: 'index',
      //   intersect: false
      // },
      // responsive: true,
      // plugins: {
      //   legend: {
      //     labels: {
      //       color: '#ebedef'
      //     }
      //   },
      //   tooltips: {
      //     mode: 'index',
      //     intersect: false
      //   }
      // },
      // scales: {
      //   x: {
      //     stacked: true,
      //     ticks: {
      //       color: '#ebedef'
      //     },
      //     grid: {
      //       color: 'rgba(255,255,255,0.2)'
      //     }
      //   },
      //   y: {
      //     stacked: true,
      //     ticks: {
      //       color: '#ebedef'
      //     },
      //     grid: {
      //       color: 'rgba(255,255,255,0.2)'
      //     }
      //   }
      // }
    }
  }
  ngOnInit(): void {
    this.subscription = this.wss.connect('', {
      // openObserver: { next: () => this.notify = 'Conexión establecida' },
      // closingObserver: { next: () => this.notify = '[DataService]: connection closing' },
      // closeObserver: {
      //   next: event => {
      //     this.notify = `Conexión cerrada ${event.wasClean ? 'limpiamente' : 'con problemas'}.`
      //   }
      // },
      reconnect: true
    }).subscribe({
      next: data => this.received(data),
      // error: event => {
      //   this.notify = `ERROR: código: ${event.code}${event.reason ? ` motivo=${event.reason}` : ''}.`
      // },
    })
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  received(data: any) {
    // if (this.simple) {
    //   for (let i = 0; i < data.cpu.length; i++) {
    //     // this.simple.datasets[i].data[0]=data.cpu[i].times['user']
    //     // this.simple.datasets[i].data[1]=data.cpu[i].times['sys']
    //     // this.simple.datasets[i].data[2]=data.cpu[i].times['idle']
    //     this.simple.datasets[i].data = [data.cpu[i].times['user'], data.cpu[i].times['sys'], data.cpu[i].times['idle'],]
    //   }
    // } else {
    // const labels = ['user', 'sys' /*, 'idle'*/]
    // const datasets = []
    // for (let i = 0; i < data.cpu.length; i++) {
    //   datasets.push({ label: `CPU ${i + 1}`, data: [data.cpu[i].times['user'], data.cpu[i].times['sys'], /*data.cpu[i].times['idle'],*/] })
    // }
    // this.simple = { labels, datasets };
    // }
    const labels = ['cpu', 'memory', 'disk', 'network']
    const datasets = []
    const multiple = []
    for (const item of data) {
      datasets.push({ label: item.name, data: [item.cpu, item.memory, item.disk, item.network], })
      multiple.push({ labels, datasets: [{ label: item.name, data: [item.cpu, item.memory, item.disk, item.network] }] })
    }
    this.multiple = multiple
    this.simple = { labels, datasets };
  }
}
