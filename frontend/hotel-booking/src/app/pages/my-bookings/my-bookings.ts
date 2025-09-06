import { Component, OnInit, inject } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import Keycloak from 'keycloak-js';

import { MyBookingsService } from './services/my-bookings.service';
import { Booking } from '../../shared/models/booking';
import { BookingCardComponent } from './components/booking-card/booking-card';
import { CancelBookingDialogComponent } from './components/cancel-booking-dialog/cancel-booking-dialog';

@Component({
  selector: 'app-my-bookings',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule,
    BookingCardComponent,
    AsyncPipe
  ],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss',
  providers: [MyBookingsService]
})
export class MyBookingsComponent implements OnInit {
  private keycloak = inject(Keycloak);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  bookings$!: Observable<Booking[]>;
  isLoading$!: Observable<boolean>;
  error$!: Observable<Error | null>;
  hasLoaded$!: Observable<boolean>;
  userEmail = '';

  constructor(private myBookingsService: MyBookingsService) {}

  ngOnInit() {
    this.userEmail = this.keycloak.tokenParsed?.['email'] || '';
    this.setupObservables();

    if (this.userEmail) {
      this.loadBookings();
    }
  }

  private setupObservables() {
    this.bookings$ = this.myBookingsService.bookings$;
    this.isLoading$ = this.myBookingsService.isLoading$;
    this.error$ = this.myBookingsService.error$;
    this.hasLoaded$ = this.myBookingsService.hasLoaded$;

    this.error$.subscribe(error => {
      if (error) {
        this.snackBar.open(
          'Error loading your bookings. Please try again.',
          'Close',
          { duration: 5000 }
        );
      }
    });
  }

  private loadBookings() {
    this.myBookingsService.getBookingsByEmail(this.userEmail).subscribe({
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });
  }

  onCancelBooking(booking: Booking) {
    const dialogRef = this.dialog.open(CancelBookingDialogComponent, {
      width: '400px',
      data: { booking }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && booking.id) {
        this.cancelBooking(booking.id);
      }
    });
  }

  private cancelBooking(bookingId: string) {
    this.myBookingsService.cancelBooking(bookingId).subscribe({
      next: () => {
        this.snackBar.open(
          'Booking cancelled successfully',
          'Close',
          { duration: 3000 }
        );
        this.myBookingsService.refreshBookings(this.userEmail);
      },
      error: (error) => {
        console.error('Error cancelling booking:', error);
        this.snackBar.open(
          'Error cancelling booking. Please try again.',
          'Close',
          { duration: 5000 }
        );
      }
    });
  }
}
