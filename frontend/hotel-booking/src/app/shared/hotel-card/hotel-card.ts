import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Hotel } from '../models/hotel';

@Component({
  selector: 'app-hotel-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.scss'
})
export class HotelCardComponent {
  @Input() hotel!: Hotel;
  @Input() showBookButton: boolean = true;
  @Output() bookHotel = new EventEmitter<string>();

  onBookHotel() {
    this.bookHotel.emit(this.hotel.id);
  }

  getRatingStars(): string[] {
    const rating = this.hotel.rating.average;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars: string[] = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }

    if (hasHalfStar) {
      stars.push('star_half');
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push('star_border');
    }

    return stars;
  }

  getLocation(): string {
    return `${this.hotel.address.city}, ${this.hotel.address.country}`;
  }

  getMainImage(): string {
    return this.hotel.images.length > 0
      ? this.hotel.images[0]
      : 'https://via.placeholder.com/300x200?text=Hotel+Image';
  }
}
