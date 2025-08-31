import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { RoomSearchFilters, SearchApiResponse, SearchResultItem, HotelSearchResult } from '../../../shared/models/booking';
import { API_URL } from '../../../core/api-url-token';
import { BaseStateService } from '../../../core/services/base-state.service';

@Injectable()
export class SearchService extends BaseStateService<SearchResultItem[]> {
  private http = inject(HttpClient);
  private API_URL = inject(API_URL);

  // Renamed from searchResults$ to data$ (inherited from BaseStateService)
  public searchResults$ = this.data$;

  public hasSearched$ = this.hasLoaded$; // Use inherited hasLoaded$

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

    this.setState({ status: 'loading' });

    return this.http.get<SearchApiResponse>(url, { params }).pipe(
      tap({
        next: (response) => {
          const transformedResults = this.transformSearchResults(response.data || []);
          this.setState({
            status: 'success',
            data: transformedResults,
          });
        },
        error: (error) =>
          this.setState({
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
