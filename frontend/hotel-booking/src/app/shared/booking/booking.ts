import { Component, Input, OnInit } from '@angular/core';
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

import { BookingService } from './services/booking.service';
import { CreateBookingRequest } from '../models/booking';

@Component({
  selector: 'app-booking',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
  providers: [BookingService]
})
export class BookingComponent implements OnInit {
  @Input() hotelId: string = '687bffd29269aba3ee6dfd72';
  @Input() roomTypeId: string = '687bffd29269aba3ee6dfd78';
  @Input() pricePerNight: number = 250;

  bookingForm!: FormGroup;
  isSubmitting = false;
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.bookingForm = this.fb.group({
      guestName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      guestLastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      guestPhone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s\-()]{7,20}$/)]],
      guestEmail: ['', [Validators.required, Validators.email]],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      numberOfGuests: [1, [Validators.required, Validators.min(1), Validators.max(20)]]
    });

    this.bookingForm.get('checkOutDate')?.valueChanges.subscribe(() => {
      this.validateDates();
    });

    this.bookingForm.get('checkInDate')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
  }

  private validateDates() {
    const checkIn = this.bookingForm.get('checkInDate')?.value;
    const checkOut = this.bookingForm.get('checkOutDate')?.value;

    if (checkIn && checkOut && checkIn >= checkOut) {
      this.bookingForm.get('checkOutDate')?.setErrors({ 'invalidDate': true });
    }
  }

  getTotalAmount(): number {
    const checkIn = this.bookingForm.get('checkInDate')?.value;
    const checkOut = this.bookingForm.get('checkOutDate')?.value;

    if (checkIn && checkOut && this.pricePerNight) {
      const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
      return nights * this.pricePerNight;
    }

    return 0;
  }

  getNights(): number {
    const checkIn = this.bookingForm.get('checkInDate')?.value;
    const checkOut = this.bookingForm.get('checkOutDate')?.value;

    if (checkIn && checkOut) {
      return Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    }

    return 0;
  }

  onSubmit() {
    if (this.bookingForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const bookingData: CreateBookingRequest = {
        hotelId: this.hotelId,
        roomTypeId: this.roomTypeId,
        guestName: this.bookingForm.value.guestName,
        guestLastName: this.bookingForm.value.guestLastName,
        guestPhone: this.bookingForm.value.guestPhone,
        guestEmail: this.bookingForm.value.guestEmail,
        checkInDate: this.bookingForm.value.checkInDate.toISOString().split('T')[0],
        checkOutDate: this.bookingForm.value.checkOutDate.toISOString().split('T')[0],
        numberOfGuests: this.bookingForm.value.numberOfGuests,
        totalAmount: this.getTotalAmount()
      };

      this.bookingService.createBooking(bookingData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.snackBar.open(
            'Booking created successfully! We will contact you soon.',
            'Close',
            { duration: 5000 }
          );
          this.bookingForm.reset();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating booking:', error);
          this.snackBar.open(
            'Error creating the booking. Please try again.',
            'Close',
            { duration: 5000 }
          );
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.bookingForm.controls).forEach(key => {
      const control = this.bookingForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.bookingForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Email must have a valid format';
    }
    if (control?.hasError('minlength')) {
      return `${this.getFieldDisplayName(fieldName)} must be at least 2 characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${this.getFieldDisplayName(fieldName)} cannot exceed 100 characters`;
    }
    if (control?.hasError('pattern')) {
      return 'Phone must have a valid format';
    }
    if (control?.hasError('min')) {
      return 'There must be at least 1 guest';
    }
    if (control?.hasError('max')) {
      return 'Cannot accommodate more than 20 guests';
    }
    if (control?.hasError('invalidDate')) {
      return 'Check-out date must be after check-in date';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'guestName': 'First name',
      'guestLastName': 'Last name',
      'guestPhone': 'Phone',
      'guestEmail': 'Email',
      'checkInDate': 'Check-in date',
      'checkOutDate': 'Check-out date',
      'numberOfGuests': 'Number of guests'
    };
    return displayNames[fieldName] || fieldName;
  }
}
