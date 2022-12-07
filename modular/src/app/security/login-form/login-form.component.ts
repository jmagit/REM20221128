import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common-services';
import { LoginService } from '../security.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  txtUsuario = 'adm@example.com';
  txtPassword = 'P@$$w0rd';
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  txtButon = 'Log In';

  constructor(public loginSrv: LoginService, private notify: NotificationService, private route: ActivatedRoute, private router: Router) { }
  onSubmit() {
    if (this.loginSrv.isAutenticated) {
      this.loginSrv.logout();
      this.cambiaTexto();
    } else {
      this.loginSrv.login(this.txtUsuario, this.txtPassword).subscribe({
        next: data => {
          if (data) {
            let act = this.router.getCurrentNavigation()
            if(this.route.snapshot.queryParams['returnUrl']){
              this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl']);
              return
            }
            this.cambiaTexto();
            this.isLoginFailed = false;
            this.isLoggedIn = true;
          } else {
            this.isLoginFailed = true;
            this.errorMessage = 'Usuario o contraseña invalida.';
          }
        },
        error: err => { this.notify.add(err.message); }
      });
    }
  }

  private cambiaTexto() {
    this.txtButon = this.loginSrv.isAutenticated ? 'Log Out' : 'Log In';
  }

  registrar() {
    this.router.navigateByUrl('/registro');
  }

  reloadPage(): void {
    window.location.reload();
  }
}
