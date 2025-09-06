import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {
  BookingApiResponse,
  CreateBookingRequest
} from '../../models/booking';
import {API_URL} from '../../../core/api-url-token';

@Injectable()
export class BookingService {
  private http = inject(HttpClient);
  private API_URL = inject(API_URL);

  createBooking(bookingData: CreateBookingRequest): Observable<BookingApiResponse> {
    const url = `${this.API_URL}/api/bookings`;
    return this.http.post<BookingApiResponse>(url, bookingData);
  }
}
