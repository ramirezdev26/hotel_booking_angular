import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HotelCardComponent, Hotel } from '../../shared/hotel-card/hotel-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatGridListModule, MatButtonModule, MatIconModule, HotelCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  hotels: Hotel[] = [];

  ngOnInit() {
    this.loadMockHotels();
  }

  onHotelBooked(hotelId: number) {
    console.log(`Booking hotel with ID: ${hotelId}`);
    // Here you would typically navigate to booking page or open booking modal
  }

  private loadMockHotels() {
    this.hotels = [
      {
        id: 1,
        name: 'Grand Plaza Hotel',
        location: 'New York City, NY',
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
        description: 'Luxury hotel in the heart of Manhattan with stunning city views.',
        pricePerNight: 299,
        amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant']
      },
      {
        id: 2,
        name: 'Ocean View Resort',
        location: 'Miami Beach, FL',
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
        description: 'Beautiful beachfront resort with direct ocean access.',
        pricePerNight: 189,
        amenities: ['Beach Access', 'Pool', 'Bar', 'WiFi']
      },
      {
        id: 3,
        name: 'Mountain Lodge',
        location: 'Aspen, CO',
        rating: 4.3,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
        description: 'Cozy mountain retreat perfect for skiing and outdoor activities.',
        pricePerNight: 249,
        amenities: ['Ski Access', 'Fireplace', 'WiFi', 'Restaurant']
      },
      {
        id: 4,
        name: 'City Center Business Hotel',
        location: 'Chicago, IL',
        rating: 4.2,
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
        description: 'Modern business hotel with conference facilities.',
        pricePerNight: 159,
        amenities: ['Business Center', 'WiFi', 'Gym', 'Conference Rooms']
      },
      {
        id: 5,
        name: 'Historic Boutique Inn',
        location: 'Savannah, GA',
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
        description: 'Charming historic hotel in the heart of Savannah\'s historic district.',
        pricePerNight: 179,
        amenities: ['Historic Building', 'WiFi', 'Restaurant', 'Garden']
      },
      {
        id: 6,
        name: 'Desert Oasis Resort',
        location: 'Scottsdale, AZ',
        rating: 4.4,
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
        description: 'Luxurious desert resort with world-class spa and golf course.',
        pricePerNight: 329,
        amenities: ['Golf Course', 'Spa', 'Pool', 'Desert Views', 'WiFi']
      }
    ];
  }
}
