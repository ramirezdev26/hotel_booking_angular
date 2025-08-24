import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';

import { BookingsListApiResponse, Booking } from '../../../shared/models/booking';
import { API_URL } from '../../../core/api-url-token';

type BookingsState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; bookings: Booking[] }
  | { status: 'error'; error: Error };

@Injectable()
export class MyBookingsService implements OnDestroy {
  private http = inject(HttpClient);
  private API_URL = inject(API_URL);
  private bookingsState$ = new BehaviorSubject<BookingsState>({
    status: 'idle',
  });

  public bookings$: Observable<Booking[]> = this.bookingsState$
    .asObservable()
    .pipe(
      filter((state) => state.status === 'success'),
      map((state) => state.bookings)
    );

  public isLoading$: Observable<boolean> = this.bookingsState$
    .asObservable()
    .pipe(map(({ status }) => status === 'loading'));

  public error$: Observable<Error | null> = this.bookingsState$
    .asObservable()
    .pipe(
      map((state) => state.status === 'error' ? state.error : null)
    );

  public hasLoaded$: Observable<boolean> = this.bookingsState$
    .asObservable()
    .pipe(map(({ status }) => status !== 'idle'));

  ngOnDestroy(): void {
    this.bookingsState$.complete();
  }

  getBookingsByEmail(email: string): Observable<Booking[]> {
    const url = `${this.API_URL}/api/bookings/guest/${encodeURIComponent(email)}`;

    this.bookingsState$.next({ status: 'loading' });

    return this.http.get<BookingsListApiResponse>(url).pipe(
      tap({
        next: (response) =>
          this.bookingsState$.next({
            status: 'success',
            bookings: response.data || [],
          }),
        error: (error) =>
          this.bookingsState$.next({
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

  resetState(): void {
    this.bookingsState$.next({ status: 'idle' });
  }
}
