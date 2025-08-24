import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="not-found-page">
      <div class="error-content">
        <div class="error-icon">
          <mat-icon>error_outline</mat-icon>
        </div>

        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you are looking for doesn't exist.</p>

        <div class="actions">
          <button mat-raised-button color="primary" routerLink="/home">
            <mat-icon>home</mat-icon>
            Go Home
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
    }

    .error-content {
      max-width: 500px;

      .error-icon {
        mat-icon {
          font-size: 6rem;
          width: 6rem;
          height: 6rem;
          color: #f44336;
          margin-bottom: 20px;
        }
      }
    }
  `]
})
export class NotFoundComponent {}
