export interface Hostel {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrls: string[];
  mainImage: string;
  price: number;
  amenities: string[];
  rating: number;
  reviews: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
}

export interface Room {
  id: string;
  hostelId: string;
  type: 'single' | 'shared' | 'self-contained';
  price: number;
  description: string;
  available: boolean;
  status: 'available' | 'booked' | 'occupied';
  capacity: number;
  amenities: string[];
  imageUrls: string[];
}

export interface BookingRequest {
  id: string;
  userId: string;
  hostelId: string;
  roomId: string;
  name: string;
  phone: string;
  email: string;
  checkInDate: string;
  roomType: string;
  depositAmount: number;
  depositPaid: boolean;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings: string[];
}

export type FilterOptions = {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  roomType?: string[];
}