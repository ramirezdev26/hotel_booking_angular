import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { Booking } from '../../../../shared/models/booking';

@Component({
  selector: 'app-booking-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DatePipe
  ],
  templateUrl: './booking-card.html',
  styleUrl: './booking-card.scss'
})
export class BookingCardComponent {
  @Input() booking!: Booking;
  @Output() cancelBooking = new EventEmitter<Booking>();

  onCancelBooking() {
    this.cancelBooking.emit(this.booking);
  }

  getLocation(): string {
    if (this.booking.hotel?.address) {
      return `${this.booking.hotel.address.city}, ${this.booking.hotel.address.country}`;
    }
    return 'Location not available';
  }

  getNights(): number {
    const checkIn = new Date(this.booking.checkInDate);
    const checkOut = new Date(this.booking.checkOutDate);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  }
}
