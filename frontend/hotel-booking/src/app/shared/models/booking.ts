export interface Booking {
  id?: string;
  hotelId: string;
  roomTypeId: string;
  guestName: string;
  guestLastName: string;
  guestPhone: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;

  hotel?: {
    name: string;
    address: {
      city: string;
      country: string;
      street?: string;
    };
  };
  roomType?: {
    name: string;
    pricePerNight: number;
  };
}

export interface BookingApiResponse {
  success: boolean;
  message: string;
  data?: Booking;
}

export interface BookingsListApiResponse {
  success: boolean;
  message: string;
  data?: Booking[];
}

export interface CreateBookingRequest {
  hotelId: string;
  roomTypeId: string;
  guestName: string;
  guestLastName: string;
  guestPhone: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
}

export interface RoomSearchFilters {
  location: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  capacity: {
    adults: number;
    children: number;
    totalGuests: number;
  };
  bedConfiguration: {
    singleBeds: number;
    doubleBeds: number;
    sofaBeds: number;
  };
  amenities: string[];
  images: string[];
  pricing: {
    basePrice: number;
    currency: string;
    discounts: any[];
  };
  availability: boolean;
  calculatedPricing: {
    basePrice: number;
    nights: number;
    subtotal: number;
    discount: number;
    totalPrice: number;
    currency: string;
  };
}

export interface HotelSearchResult {
  hotel: {
    id: string;
    name: string;
    description: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
    contact: {
      phone: string;
      email: string;
      website: string;
    };
    amenities: string[];
    rating: {
      average: number;
      totalReviews: number;
    };
    images: string[];
  };
  availableRoomTypes: RoomType[];
  matchScore: number;
}

export interface SearchApiResponse {
  success: boolean;
  message: string;
  data: HotelSearchResult[];
  summary: {
    totalHotels: number;
    totalRoomTypes: number;
    searchCriteria: any;
    priceRange: {
      min: number;
      max: number;
      currency: string;
    };
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SearchResultItem {
  hotelId: string;
  hotelName: string;
  hotelAddress: {
    city: string;
    country: string;
  };
  roomTypeId: string;
  roomTypeName: string;
  pricePerNight: number;
  maxOccupancy: number;
  calculatedPricing: {
    totalNights: number;
    totalPrice: number;
  };
  hotelRating?: number;
  hotelImages?: string[];
}
