import { Hostel, Room } from "../types";

// Mock Hostel Data
export const hostels: Hostel[] = [
  {
    id: "h1",
    name: "Sunset Student Residence",
    description: "A modern hostel with a stunning view of the city skyline, offering comfortable and affordable accommodation for students. Located just 5 minutes from the university campus.",
    location: "123 University Road, Fort Portal",
    imageUrls: [
      "/images/hostels/sunset-residence-1.jpg",
      "/images/hostels/sunset-residence-2.jpg",
      "/images/hostels/sunset-residence-3.jpg",
    ],
    mainImage: "/images/hostels/sunset-residence-1.jpg",
    price: 550000, // UGX per semester
    amenities: ["Wi-Fi", "24/7 Security", "Water", "Electricity", "Study Room", "Laundry"],
    rating: 4.5,
    reviews: 24,
    coordinates: {
      lat: 0.6652,
      lng: 30.2636,
    },
    contact: {
      phone: "+256 700 123 456",
      email: "info@sunsetresidence.com",
      whatsapp: "+256 700 123 456",
    },
  },
  {
    id: "h2",
    name: "MMU Comfort Hostels",
    description: "Located right opposite the university main gate, MMU Comfort Hostels provides secure and convenient accommodation with 24/7 security and reliable utilities.",
    location: "Opposite MMU Main Gate, Fort Portal",
    imageUrls: [
      "/images/hostels/comfort-hostel-1.jpg",
      "/images/hostels/comfort-hostel-2.jpg",
      "/images/hostels/comfort-hostel-3.jpg",
    ],
    mainImage: "/images/hostels/comfort-hostel-1.jpg",
    price: 450000, // UGX per semester
    amenities: ["Wi-Fi", "24/7 Security", "Water", "Electricity", "Canteen", "Common Room"],
    rating: 4.2,
    reviews: 18,
    coordinates: {
      lat: 0.6655,
      lng: 30.2640,
    },
    contact: {
      phone: "+256 700 987 654",
      email: "info@mmucomforthostels.com",
    },
  },
  {
    id: "h3",
    name: "Greenview Student Apartments",
    description: "Luxury student apartments with private bathrooms and kitchenettes. Experience premium student living with beautiful gardens and outdoor study areas.",
    location: "45 Nyakaana Street, Fort Portal",
    imageUrls: [
      "/images/hostels/greenview-1.jpg",
      "/images/hostels/greenview-2.jpg",
      "/images/hostels/greenview-3.jpg",
    ],
    mainImage: "/images/hostels/greenview-1.jpg",
    price: 750000, // UGX per semester
    amenities: ["Wi-Fi", "24/7 Security", "Water", "Electricity", "Private Bathroom", "Kitchenette", "Gym", "Recreation Area"],
    rating: 4.8,
    reviews: 32,
    coordinates: {
      lat: 0.6670,
      lng: 30.2620,
    },
    contact: {
      phone: "+256 700 555 777",
      email: "stay@greenviewapartments.com",
      whatsapp: "+256 700 555 777",
    },
  },
  {
    id: "h4",
    name: "Budget Student Hub",
    description: "Affordable accommodation with all essential amenities for students on a budget. Clean, comfortable, and close to public transport.",
    location: "78 Rukidi Street, Fort Portal",
    imageUrls: [
      "/images/hostels/budget-hub-1.jpg",
      "/images/hostels/budget-hub-2.jpg",
      "/images/hostels/budget-hub-3.jpg",
    ],
    mainImage: "/images/hostels/budget-hub-1.jpg",
    price: 350000, // UGX per semester
    amenities: ["Wi-Fi", "Security", "Water", "Electricity", "Shared Kitchen"],
    rating: 3.9,
    reviews: 15,
    coordinates: {
      lat: 0.6680,
      lng: 30.2650,
    },
    contact: {
      phone: "+256 700 222 333",
      email: "info@budgethub.com",
    },
  },
  {
    id: "h5",
    name: "Scholars' Haven",
    description: "A quiet and studious environment perfect for serious students. Features dedicated study spaces and a library.",
    location: "12 Kaboyo Road, Fort Portal",
    imageUrls: [
      "/images/hostels/scholars-haven-1.jpg",
      "/images/hostels/scholars-haven-2.jpg",
      "/images/hostels/scholars-haven-3.jpg",
    ],
    mainImage: "/images/hostels/scholars-haven-1.jpg",
    price: 600000, // UGX per semester
    amenities: ["Wi-Fi", "24/7 Security", "Water", "Electricity", "Library", "Study Rooms", "Printing Services"],
    rating: 4.6,
    reviews: 22,
    coordinates: {
      lat: 0.6660,
      lng: 30.2630,
    },
    contact: {
      phone: "+256 700 888 999",
      email: "admin@scholarshaven.com",
      whatsapp: "+256 700 888 999",
    },
  },
];

// Mock Room Data
export const rooms: Room[] = [
  // Sunset Student Residence Rooms
  {
    id: "r1",
    hostelId: "h1",
    type: "single",
    price: 550000,
    description: "A comfortable single room with a bed, desk, and storage space.",
    available: true,
    status: "available",
    capacity: 1,
    amenities: ["Bed", "Desk", "Wardrobe", "Bedding", "Reading Lamp"],
    imageUrls: ["/images/hostels/sunset-single-room.jpg"],
  },
  {
    id: "r2",
    hostelId: "h1",
    type: "shared",
    price: 350000,
    description: "A spacious shared room with two beds, desks, and storage space.",
    available: true,
    status: "available",
    capacity: 2,
    amenities: ["Beds", "Desks", "Wardrobes", "Bedding", "Reading Lamps"],
    imageUrls: ["/images/hostels/sunset-shared-room.jpg"],
  },
  {
    id: "r3",
    hostelId: "h1",
    type: "self-contained",
    price: 750000,
    description: "A premium self-contained room with a private bathroom and kitchenette.",
    available: true,
    status: "available",
    capacity: 1,
    amenities: ["Bed", "Desk", "Wardrobe", "Private Bathroom", "Kitchenette", "Bedding", "Reading Lamp"],
    imageUrls: ["/images/hostels/sunset-self-contained.jpg"],
  },
  
  // MMU Comfort Hostels Rooms
  {
    id: "r4",
    hostelId: "h2",
    type: "single",
    price: 450000,
    description: "A cozy single room close to the university main gate.",
    available: true,
    status: "available",
    capacity: 1,
    amenities: ["Bed", "Desk", "Wardrobe", "Bedding"],
    imageUrls: ["/images/hostels/comfort-single-room.jpg"],
  },
  {
    id: "r5",
    hostelId: "h2",
    type: "shared",
    price: 300000,
    description: "An affordable shared room with all essential amenities.",
    available: false,
    status: "booked",
    capacity: 2,
    amenities: ["Beds", "Desks", "Wardrobes", "Bedding"],
    imageUrls: ["/images/hostels/comfort-shared-room.jpg"],
  },
  
  // Greenview Student Apartments Rooms
  {
    id: "r6",
    hostelId: "h3",
    type: "self-contained",
    price: 750000,
    description: "A luxury self-contained apartment with modern furnishings.",
    available: true,
    status: "available",
    capacity: 1,
    amenities: ["Queen Bed", "Study Desk", "Wardrobe", "Private Bathroom", "Kitchenette", "TV", "Fridge"],
    imageUrls: ["/images/hostels/greenview-self-contained.jpg"],
  },
  {
    id: "r7",
    hostelId: "h3",
    type: "single",
    price: 600000,
    description: "A premium single room with access to shared kitchen and bathroom.",
    available: true,
    status: "available",
    capacity: 1,
    amenities: ["Bed", "Desk", "Wardrobe", "Bedding", "Reading Lamp", "Air Conditioning"],
    imageUrls: ["/images/hostels/greenview-single-room.jpg"],
  },
  
  // Budget Student Hub Rooms
  {
    id: "r8",
    hostelId: "h4",
    type: "shared",
    price: 250000,
    description: "An economical shared room for budget-conscious students.",
    available: true,
    status: "available",
    capacity: 3,
    amenities: ["Beds", "Desks", "Wardrobes", "Bedding"],
    imageUrls: ["/images/hostels/budget-shared-room.jpg"],
  },
  {
    id: "r9",
    hostelId: "h4",
    type: "single",
    price: 350000,
    description: "A basic single room with all necessary amenities.",
    available: true,
    status: "available",
    capacity: 1,
    amenities: ["Bed", "Desk", "Wardrobe", "Bedding"],
    imageUrls: ["/images/hostels/budget-single-room.jpg"],
  },
  
  // Scholars' Haven Rooms
  {
    id: "r10",
    hostelId: "h5",
    type: "single",
    price: 600000,
    description: "A quiet single room perfect for focused studying.",
    available: true,
    status: "available",
    capacity: 1,
    amenities: ["Bed", "Study Desk", "Bookshelf", "Wardrobe", "Bedding", "Reading Lamp", "Ergonomic Chair"],
    imageUrls: ["/images/hostels/scholars-single-room.jpg"],
  },
  {
    id: "r11",
    hostelId: "h5",
    type: "self-contained",
    price: 800000,
    description: "A premium self-contained room with additional study space.",
    available: false,
    status: "occupied",
    capacity: 1,
    amenities: ["Bed", "Study Desk", "Bookshelf", "Wardrobe", "Private Bathroom", "Bedding", "Reading Lamp", "Ergonomic Chair"],
    imageUrls: ["/images/hostels/scholars-self-contained.jpg"],
  }
];

// Helper functions
export const getHostelById = (id: string): Hostel | undefined => {
  return hostels.find(hostel => hostel.id === id);
};

export const getRoomsByHostelId = (hostelId: string): Room[] => {
  return rooms.filter(room => room.hostelId === hostelId);
};

export const getAvailableRoomsByHostelId = (hostelId: string): Room[] => {
  return rooms.filter(room => room.hostelId === hostelId && room.status === 'available');
};

export const getRoomById = (id: string): Room | undefined => {
  return rooms.find(room => room.id === id);
};

// Filter hostels based on user preferences
import { FilterOptions } from "../types";

export const filterHostels = (hostelsToFilter: Hostel[], filters: FilterOptions) => {
  return hostelsToFilter.filter(hostel => {
    // Filter by price range
    if (filters.minPrice && hostel.price < filters.minPrice) return false;
    if (filters.maxPrice && hostel.price > filters.maxPrice) return false;
    
    // Filter by location
    if (filters.location && filters.location.trim() !== "" && 
        !hostel.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Filter by amenities
    if (filters.amenities && filters.amenities.length > 0) {
      for (const amenity of filters.amenities) {
        if (!hostel.amenities.includes(amenity)) {
          return false;
        }
      }
    }
    
    // Filter by rating
    if (filters.minRating && hostel.rating < filters.minRating) return false;
    
    return true;
  });
};