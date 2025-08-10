import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent, LoginData } from '../login/login';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  isLoggedIn = false;
  userName = 'Guest User';

  constructor(private dialog: MatDialog) {}

  onLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'login-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        const loginData: LoginData = result.data;
        this.isLoggedIn = true;
        this.userName = loginData.username;
        console.log('User logged in:', loginData);
      }
    });
  }

  onLogout() {
    this.isLoggedIn = false;
    this.userName = 'Guest User';
    console.log('User logged out');
  }
}
