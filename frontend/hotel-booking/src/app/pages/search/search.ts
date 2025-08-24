import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SearchService } from './services/search.service';
import { RoomSearchFilters, SearchResultItem } from '../../shared/models/booking';
import { SearchResultCardComponent } from './components/search-result-card/search-result-card';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    SearchResultCardComponent
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  providers: [SearchService]
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  searchResults$!: Observable<SearchResultItem[]>;
  isLoading$!: Observable<boolean>;
  error$!: Observable<Error | null>;
  hasSearched$!: Observable<boolean>;
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.setupObservables();
  }

  private setupObservables() {
    this.searchResults$ = this.searchService.searchResults$;
    this.isLoading$ = this.searchService.isLoading$;
    this.error$ = this.searchService.error$;
    this.hasSearched$ = this.searchService.hasSearched$;

    this.error$.subscribe(error => {
      if (error) {
        this.snackBar.open(
          'Error searching for rooms. Please try again.',
          'Close',
          { duration: 5000 }
        );
      }
    });

    this.searchResults$.subscribe(results => {
      this.hasSearched$.subscribe(hasSearched => {
        if (hasSearched && results.length === 0) {
          this.snackBar.open(
            'No rooms found with the specified criteria',
            'Close',
            { duration: 3000 }
          );
        }
      });
    });
  }

  private createForm() {
    this.searchForm = this.fb.group({
      location: ['', [Validators.required, Validators.minLength(2)]],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      numberOfGuests: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      minPrice: [''],
      maxPrice: ['']
    });

    this.searchForm.get('checkOutDate')?.valueChanges.subscribe(() => {
      this.validateDates();
    });

    this.searchForm.get('checkInDate')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
  }

  private validateDates() {
    const checkIn = this.searchForm.get('checkInDate')?.value;
    const checkOut = this.searchForm.get('checkOutDate')?.value;

    if (checkIn && checkOut && checkIn >= checkOut) {
      this.searchForm.get('checkOutDate')?.setErrors({ 'invalidDate': true });
    }
  }

  onSearch() {
    if (this.searchForm.valid) {
      const formValue = this.searchForm.value;

      const filters: RoomSearchFilters = {
        location: formValue.location,
        checkInDate: formValue.checkInDate.toISOString().split('T')[0],
        checkOutDate: formValue.checkOutDate.toISOString().split('T')[0],
        numberOfGuests: formValue.numberOfGuests
      };

      if (formValue.minPrice || formValue.maxPrice) {
        filters.priceRange = {
          min: formValue.minPrice || 0,
          max: formValue.maxPrice || 999999
        };
      }

      this.searchService.searchRooms(filters).subscribe({
        error: (error) => {
          console.error('Error searching rooms:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onBookRoom(roomData: SearchResultItem) {
    this.router.navigate(['/booking'], {
      queryParams: {
        hotelId: roomData.hotelId,
        roomTypeId: roomData.roomTypeId,
        pricePerNight: roomData.pricePerNight,
        checkInDate: this.searchForm.value.checkInDate?.toISOString().split('T')[0],
        checkOutDate: this.searchForm.value.checkOutDate?.toISOString().split('T')[0],
        numberOfGuests: this.searchForm.value.numberOfGuests
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.searchForm.controls).forEach(key => {
      const control = this.searchForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.searchForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${this.getFieldDisplayName(fieldName)} must be at least 2 characters`;
    }
    if (control?.hasError('min')) {
      return 'Number of guests must be at least 1';
    }
    if (control?.hasError('max')) {
      return 'Number of guests cannot exceed 20';
    }
    if (control?.hasError('invalidDate')) {
      return 'Check-out date must be after check-in date';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'location': 'Location',
      'checkInDate': 'Check-in date',
      'checkOutDate': 'Check-out date',
      'numberOfGuests': 'Number of guests',
      'minPrice': 'Minimum price',
      'maxPrice': 'Maximum price'
    };
    return displayNames[fieldName] || fieldName;
  }
}
