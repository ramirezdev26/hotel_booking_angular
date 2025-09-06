import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import Keycloak  from 'keycloak-js';
import { inject } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  private keycloak = inject(Keycloak);

  isLoggedIn = false;
  userName = '';

  ngOnInit() {
    this.isLoggedIn = this.keycloak.authenticated || false;

    if (this.isLoggedIn) {
      this.userName = this.keycloak.tokenParsed?.['preferred_username'] || 'Usuario';
    }
  }

  onLogin() {
    this.keycloak.login();
  }

  onLogout() {
    this.keycloak.logout();
  }
}
