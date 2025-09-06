import { Component, OnInit, OnDestroy } from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { HotelCardComponent } from '../../shared/hotel-card/hotel-card';
import { Hotel } from '../../shared/models/hotel';
import { HomeService } from './services/home.service';

@Component({
  selector: 'app-home',
  imports: [
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    HotelCardComponent,
    AsyncPipe
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  providers: [HomeService]
})
export class HomeComponent implements OnInit {
  hotels$!: Observable<Hotel[]>;
  isLoading$!: Observable<boolean>;
  error$!: Observable<Error | null>;

  constructor(
    private homeService: HomeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.hotels$ = this.homeService.hotels$;
    this.isLoading$ = this.homeService.isLoading$;
    this.error$ = this.homeService.error$;

    this.loadHotels();

    this.error$.subscribe(error => {
      if (error) {
        this.snackBar.open(
          'Error al cargar los hoteles. Por favor, intenta de nuevo.',
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
  }

  onHotelBooked() {
    this.snackBar.open(
      'Reservar Hotel',
      'Cerrar',
      { duration: 3000 }
    );
  }

  private loadHotels() {
    this.homeService.getHotels().subscribe({
      error: (error) => {
        console.error('Error cargando hoteles:', error);
      }
    });
  }

  refreshHotels() {
    this.loadHotels();
  }
}
