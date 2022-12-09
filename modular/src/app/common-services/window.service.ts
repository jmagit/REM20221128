import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  confirm(msg: string) {
    return window.confirm(msg);
  }

  reload() {
    window.location.reload();
  }

}
