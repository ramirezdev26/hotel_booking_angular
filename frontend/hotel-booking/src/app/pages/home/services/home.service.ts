import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, map } from 'rxjs';

import { Hotel, HotelApiResponse } from '../../../shared/models/hotel';
import { API_URL } from '../../../core/api-url-token';
import { BaseStateService } from '../../../core/services/base-state.service';

@Injectable()
export class HomeService extends BaseStateService<Hotel[]> {
  private http = inject(HttpClient);
  private API_URL = inject(API_URL);

  public hotels$ = this.data$;

  getHotels(): Observable<Hotel[]> {
    const url = `${this.API_URL}/api/hotels`;

    this.setState({ status: 'loading' });

    return this.http.get<HotelApiResponse>(url).pipe(
      tap({
        next: (response) =>
          this.setState({
            status: 'success',
            data: response.data,
          }),
        error: (error) =>
          this.setState({
            status: 'error',
            error,
          }),
      }),
      map(response => response.data)
    );
  }
}
