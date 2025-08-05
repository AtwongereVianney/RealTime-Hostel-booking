import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hostel } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Star, Wifi, ShieldCheck, WaterDropIcon } from "lucide-react";

interface HostelCardProps {
  hostel: Hostel;
}

export function HostelCard({ hostel }: HostelCardProps) {
  const { id, name, location, mainImage, price, amenities, rating, reviews } = hostel;

  const highlightAmenities = amenities.slice(0, 3);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/hostels/${id}`} className="block h-48 overflow-hidden">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Hostel+Image";
          }}
        />
      </Link>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/hostels/${id}`} className="block">
            <h3 className="font-semibold text-lg hover:text-blue-600 line-clamp-1">{name}</h3>
          </Link>
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
            <span className="text-xs text-gray-500">({reviews})</span>
          </Badge>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {highlightAmenities.map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {amenity === "Wi-Fi" && <Wifi className="h-3 w-3 mr-1" />}
              {amenity === "24/7 Security" && <ShieldCheck className="h-3 w-3 mr-1" />}
              {amenity === "Water" && <WaterDropIcon className="h-3 w-3 mr-1" />}
              {amenity}
            </Badge>
          ))}
          {amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{amenities.length - 3} more
            </Badge>
          )}
        </div>
        <div className="mt-2 font-semibold text-lg">{formatCurrency(price)}<span className="text-sm font-normal text-gray-500">/semester</span></div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/hostels/${id}`}>View Details</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to={`/hostels/${id}/book`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}