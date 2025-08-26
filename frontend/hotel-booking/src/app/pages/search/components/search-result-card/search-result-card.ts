import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { SearchResultItem } from '../../../../shared/models/booking';

@Component({
  selector: 'app-search-result-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './search-result-card.html',
  styleUrl: './search-result-card.scss'
})
export class SearchResultCardComponent {
  @Input() roomData!: SearchResultItem;
  @Output() bookRoom = new EventEmitter<SearchResultItem>();

  onBookRoom() {
    this.bookRoom.emit(this.roomData);
  }

  getLocation(): string {
    return `${this.roomData.hotelAddress.city}, ${this.roomData.hotelAddress.country}`;
  }

  getRatingStars(): string[] {
    const rating = this.roomData.hotelRating || 0;
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

  getMainImage(): string {
    return this.roomData.hotelImages && this.roomData.hotelImages.length > 0
      ? this.roomData.hotelImages[0]
      : 'https://via.placeholder.com/300x200?text=Hotel+Image';
  }
}
