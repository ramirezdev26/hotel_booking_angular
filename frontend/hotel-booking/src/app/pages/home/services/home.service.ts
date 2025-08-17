import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';

import { Hotel, HotelApiResponse } from '../../../shared/models/hotel';
import { API_URL } from '../../../core/api-url-token';

type HotelState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; hotels: Hotel[] }
  | { status: 'error'; error: Error };

@Injectable()
export class HomeService implements OnDestroy {
  private http = inject(HttpClient);
  private API_URL = inject(API_URL);
  private hotelState$ = new BehaviorSubject<HotelState>({
    status: 'idle',
  });

  public hotels$: Observable<Hotel[]> = this.hotelState$
    .asObservable()
    .pipe(
      filter((state) => state.status === 'success'),
      map((state) => state.hotels)
    );

  public isLoading$: Observable<boolean> = this.hotelState$
    .asObservable()
    .pipe(map(({ status }) => status === 'loading'));

  public error$: Observable<Error | null> = this.hotelState$
    .asObservable()
    .pipe(
      map((state) => state.status === 'error' ? state.error : null)
    );

  ngOnDestroy(): void {
    this.hotelState$.complete();
  }

  getHotels(): Observable<Hotel[]> {
    const url = `${this.API_URL}/api/hotels`;

    this.hotelState$.next({ status: 'loading' });

    return this.http.get<HotelApiResponse>(url).pipe(
      tap({
        next: (response) =>
          this.hotelState$.next({
            status: 'success',
            hotels: response.data,
          }),
        error: (error) =>
          this.hotelState$.next({
            status: 'error',
            error,
          }),
      }),
      map(response => response.data)
    );
  }
}
