import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';

import { RoomSearchFilters, SearchApiResponse, SearchResultItem, HotelSearchResult } from '../../../shared/models/booking';
import { API_URL } from '../../../core/api-url-token';

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; results: SearchResultItem[] }
  | { status: 'error'; error: Error };

@Injectable()
export class SearchService implements OnDestroy {
  private http = inject(HttpClient);
  private API_URL = inject(API_URL);
  private searchState$ = new BehaviorSubject<SearchState>({
    status: 'idle',
  });

  public searchResults$: Observable<SearchResultItem[]> = this.searchState$
    .asObservable()
    .pipe(
      filter((state) => state.status === 'success'),
      map((state) => state.results)
    );

  public isLoading$: Observable<boolean> = this.searchState$
    .asObservable()
    .pipe(map(({ status }) => status === 'loading'));

  public error$: Observable<Error | null> = this.searchState$
    .asObservable()
    .pipe(
      map((state) => state.status === 'error' ? state.error : null)
    );

  public hasSearched$: Observable<boolean> = this.searchState$
    .asObservable()
    .pipe(map(({ status }) => status !== 'idle'));

  ngOnDestroy(): void {
    this.searchState$.complete();
  }

  searchRooms(filters: RoomSearchFilters): Observable<SearchResultItem[]> {
    const url = `${this.API_URL}/api/hotels/search`;

    const params: any = {
      location: filters.location,
      checkInDate: filters.checkInDate,
      checkOutDate: filters.checkOutDate,
      numberOfGuests: filters.numberOfGuests.toString()
    };

    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        params['priceRange.min'] = filters.priceRange.min.toString();
      }
      if (filters.priceRange.max !== undefined) {
        params['priceRange.max'] = filters.priceRange.max.toString();
      }
    }

    this.searchState$.next({ status: 'loading' });

    return this.http.get<SearchApiResponse>(url, { params }).pipe(
      tap({
        next: (response) => {
          const transformedResults = this.transformSearchResults(response.data || []);
          this.searchState$.next({
            status: 'success',
            results: transformedResults,
          });
        },
        error: (error) =>
          this.searchState$.next({
            status: 'error',
            error,
          }),
      }),
      map(response => this.transformSearchResults(response.data || []))
    );
  }

  private transformSearchResults(hotelResults: HotelSearchResult[]): SearchResultItem[] {
    const results: SearchResultItem[] = [];

    hotelResults.forEach(hotelResult => {
      hotelResult.availableRoomTypes.forEach(roomType => {
        results.push({
          hotelId: hotelResult.hotel.id,
          hotelName: hotelResult.hotel.name,
          hotelAddress: {
            city: hotelResult.hotel.address.city,
            country: hotelResult.hotel.address.country
          },
          roomTypeId: roomType.id,
          roomTypeName: roomType.name,
          pricePerNight: roomType.pricing.basePrice,
          maxOccupancy: roomType.capacity.totalGuests,
          calculatedPricing: {
            totalNights: roomType.calculatedPricing.nights,
            totalPrice: roomType.calculatedPricing.totalPrice
          },
          hotelRating: hotelResult.hotel.rating.average,
          hotelImages: hotelResult.hotel.images
        });
      });
    });

    return results;
  }
}
