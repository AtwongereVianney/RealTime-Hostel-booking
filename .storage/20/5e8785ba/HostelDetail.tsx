import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Hostel, Room } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Phone, Mail, Star, Wifi, ShieldCheck, Calendar, Info } from "lucide-react";

interface HostelDetailProps {
  hostel: Hostel;
  rooms: Room[];
}

export function HostelDetail({ hostel, rooms }: HostelDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-2">
            <img
              src={hostel.imageUrls[activeImageIndex] || hostel.mainImage}
              alt={hostel.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Hostel+Image";
              }}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {hostel.imageUrls.map((image, index) => (
              <div 
                key={index}
                className={`h-20 w-32 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 ${
                  activeImageIndex === index ? "border-blue-600" : "border-transparent"
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${hostel.name} - image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/300x200?text=Hostel+Image";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{hostel.name}</h1>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{hostel.rating}</span>
                  <span className="text-xs text-gray-500">({hostel.reviews} reviews)</span>
                </Badge>
              </div>
              
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{hostel.location}</span>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="font-semibold text-xl">Starting from {formatCurrency(hostel.price)}<span className="text-sm font-normal text-gray-500">/semester</span></div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {hostel.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h3 className="font-medium">Contact Information</h3>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${hostel.contact.phone}`} className="hover:text-blue-600">{hostel.contact.phone}</a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${hostel.contact.email}`} className="hover:text-blue-600">{hostel.contact.email}</a>
                </div>
                {hostel.contact.whatsapp && (
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                      <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                      <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
                    </svg>
                    <a href={`https://wa.me/${hostel.contact.whatsapp.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      WhatsApp Chat
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Button size="lg" className="w-full" asChild>
                  <Link to={`/hostels/${hostel.id}/book`}>
                    <Calendar className="mr-2 h-4 w-4" /> Book Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="description">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="rooms">Available Rooms</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="p-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About This Hostel</h2>
            <p className="text-gray-700">{hostel.description}</p>
            
            <h3 className="text-lg font-medium mt-6">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {hostel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="rooms" className="p-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Rooms</h2>
            <div className="grid grid-cols-1 gap-4">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <Card key={room.id} className={`border-l-4 ${room.status === 'available' ? 'border-l-green-500' : 'border-l-amber-500'}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-lg capitalize">{room.type} Room</h3>
                            <Badge variant={room.status === 'available' ? 'success' : 'outline'}>{room.status}</Badge>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{room.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {room.amenities.slice(0, 5).map((amenity, index) => (
                              <span key={index} className="text-xs text-gray-600 flex items-center">
                                <Info className="h-3 w-3 mr-1" />
                                {amenity}
                              </span>
                            ))}
                            {room.amenities.length > 5 && (
                              <span className="text-xs text-gray-600">+{room.amenities.length - 5} more</span>
                            )}
                          </div>
                          <p className="font-medium text-lg mt-2">{formatCurrency(room.price)}<span className="text-sm font-normal text-gray-500">/semester</span></p>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <Button 
                            disabled={room.status !== 'available'} 
                            asChild
                          >
                            <Link to={`/hostels/${hostel.id}/book?roomId=${room.id}`}>
                              Book This Room
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No rooms available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="location" className="p-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Location</h2>
            <p className="text-gray-700">{hostel.location}</p>
            
            <div className="h-[300px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              <div className="text-center p-4">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>Map view would be displayed here.</p>
                <p className="text-sm">Coordinates: {hostel.coordinates.lat}, {hostel.coordinates.lng}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium">Nearby Places</h3>
              <ul className="list-disc pl-5 mt-2 text-gray-700">
                <li>University Campus - 5 minutes walking distance</li>
                <li>Shopping Center - 10 minutes walking distance</li>
                <li>Bank and ATM - 3 minutes walking distance</li>
                <li>Restaurant and Coffee Shop - 7 minutes walking distance</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}