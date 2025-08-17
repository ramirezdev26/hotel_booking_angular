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
    id: string;
    name: string;
    address: any;
  };
  roomType?: {
    id: string;
    name: string;
    pricePerNight: number;
  };
}

export interface BookingApiResponse {
  success: boolean;
  message: string;
  data: Booking;
}

export interface BookingListApiResponse {
  success: boolean;
  message: string;
  data: Booking[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
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
