import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

export interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  imageUrl: string;
  description?: string;
  pricePerNight: number;
  amenities: string[];
}

@Component({
  selector: 'app-hotel-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.scss'
})
export class HotelCardComponent {
  @Input() hotel!: Hotel;
  @Input() showBookButton: boolean = true;
  @Output() bookHotel = new EventEmitter<number>();

  onBookHotel() {
    this.bookHotel.emit(this.hotel.id);
  }

  getRatingStars(): string[] {
    const fullStars = Math.floor(this.hotel.rating);
    const hasHalfStar = this.hotel.rating % 1 !== 0;
    const stars: string[] = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }

    if (hasHalfStar) {
      stars.push('star_half');
    }

    const emptyStars = 5 - Math.ceil(this.hotel.rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push('star_border');
    }

    return stars;
  }
}
