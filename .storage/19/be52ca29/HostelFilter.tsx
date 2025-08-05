import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterOptions } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const amenitiesOptions = [
  "Wi-Fi",
  "24/7 Security",
  "Water",
  "Electricity",
  "Study Room",
  "Laundry",
  "Canteen",
  "Common Room",
  "Private Bathroom",
  "Kitchenette",
  "Gym",
];

const roomTypeOptions = [
  { id: "single", label: "Single Room" },
  { id: "shared", label: "Shared Room" },
  { id: "self-contained", label: "Self-Contained" },
];

interface HostelFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice: number;
}

export function HostelFilter({ onFilterChange, maxPrice = 1000000 }: HostelFilterProps) {
  const [location, setLocation] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity]);
    } else {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    }
  };

  const handleRoomTypeChange = (roomType: string, checked: boolean) => {
    if (checked) {
      setSelectedRoomTypes([...selectedRoomTypes, roomType]);
    } else {
      setSelectedRoomTypes(selectedRoomTypes.filter((r) => r !== roomType));
    }
  };

  const applyFilters = () => {
    onFilterChange({
      location: location || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      amenities: selectedAmenities.length ? selectedAmenities : undefined,
      roomType: selectedRoomTypes.length ? selectedRoomTypes : undefined,
    });
  };

  const resetFilters = () => {
    setLocation("");
    setPriceRange([0, maxPrice]);
    setSelectedAmenities([]);
    setSelectedRoomTypes([]);
    onFilterChange({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filter Hostels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Price Range</Label>
            <span className="text-sm text-gray-500">
              {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            </span>
          </div>
          <Slider
            defaultValue={[0, maxPrice]}
            max={maxPrice}
            step={50000}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {amenitiesOptions.map((amenity) => (
              <div className="flex items-center space-x-2" key={amenity}>
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked === true)}
                />
                <Label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Room Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {roomTypeOptions.map((roomType) => (
              <div className="flex items-center space-x-2" key={roomType.id}>
                <Checkbox
                  id={`roomType-${roomType.id}`}
                  checked={selectedRoomTypes.includes(roomType.id)}
                  onCheckedChange={(checked) => handleRoomTypeChange(roomType.id, checked === true)}
                />
                <Label
                  htmlFor={`roomType-${roomType.id}`}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {roomType.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Button onClick={applyFilters} className="flex-1">Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
}