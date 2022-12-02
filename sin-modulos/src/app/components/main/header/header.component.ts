import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginComponent } from 'src/app/security/login/login.component';
import { AuthService } from 'src/app/security/security.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginComponent, RouterLink, NgIf, ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public auth: AuthService) { }
}
