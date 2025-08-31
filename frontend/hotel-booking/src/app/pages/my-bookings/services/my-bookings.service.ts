import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, map } from 'rxjs';

import { BookingsListApiResponse, Booking } from '../../../shared/models/booking';
import { API_URL } from '../../../core/api-url-token';
import { BaseStateService } from '../../../core/services/base-state.service';

@Injectable()
export class MyBookingsService extends BaseStateService<Booking[]> {
  private http = inject(HttpClient);
  private API_URL = inject(API_URL);

  public bookings$ = this.data$;

  getBookingsByEmail(email: string): Observable<Booking[]> {
    const url = `${this.API_URL}/api/bookings/guest/${encodeURIComponent(email)}`;

    this.setState({ status: 'loading' });

    return this.http.get<BookingsListApiResponse>(url).pipe(
      tap({
        next: (response) =>
          this.setState({
            status: 'success',
            data: response.data || [],
          }),
        error: (error) =>
          this.setState({
            status: 'error',
            error,
          }),
      }),
      map(response => response.data || [])
    );
  }

  cancelBooking(bookingId: string): Observable<any> {
    const url = `${this.API_URL}/api/bookings/${bookingId}`;
    return this.http.delete(url);
  }

  refreshBookings(email: string): void {
    this.getBookingsByEmail(email).subscribe();
  }
}
