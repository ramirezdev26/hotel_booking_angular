export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  images: string[];
  amenities: string[];
  rating: {
    average: number;
    totalReviews: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    children?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HotelApiResponse {
  success: boolean;
  message: string;
  data: Hotel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
