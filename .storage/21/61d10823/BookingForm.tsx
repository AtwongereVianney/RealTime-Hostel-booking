import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Hostel, Room, BookingRequest } from "@/lib/types";
import { formatCurrency, calculateDeposit, getCurrentDate, generateBookingId, saveToLocalStorage, getFromLocalStorage } from "@/lib/utils";
import { CheckCircle2, Info, Calendar } from "lucide-react";

interface BookingFormProps {
  hostel: Hostel;
  rooms: Room[];
  preselectedRoomId?: string;
}

export function BookingForm({ hostel, rooms, preselectedRoomId }: BookingFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roomId: preselectedRoomId || "",
    checkInDate: getCurrentDate(),
    specialRequests: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const availableRooms = rooms.filter((room) => room.status === "available");
  const selectedRoom = rooms.find((room) => room.id === formData.roomId);
  const depositAmount = selectedRoom ? calculateDeposit(selectedRoom.price) : 0;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.roomId) newErrors.roomId = "Please select a room";
    if (!formData.checkInDate) newErrors.checkInDate = "Check-in date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoomSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, roomId: value }));
    
    // Clear error when user selects
    if (errors.roomId) {
      setErrors((prev) => ({ ...prev, roomId: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const selectedRoom = rooms.find(room => room.id === formData.roomId);
      
      if (!selectedRoom) {
        setErrors({ roomId: "Selected room is no longer available" });
        setIsSubmitting(false);
        return;
      }
      
      // Create booking request
      const bookingRequest: BookingRequest = {
        id: generateBookingId(),
        userId: "user-temp", // Would be replaced with actual user ID in a real app
        hostelId: hostel.id,
        roomId: formData.roomId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        checkInDate: formData.checkInDate,
        roomType: selectedRoom.type,
        depositAmount: depositAmount,
        depositPaid: false,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      
      // Save booking to localStorage (for demo purposes)
      const existingBookings = getFromLocalStorage<BookingRequest[]>("bookings", []);
      saveToLocalStorage("bookings", [...existingBookings, bookingRequest]);
      
      // Show success message
      setIsSuccess(true);
      setIsSubmitting(false);
      
      // Navigate to payment page after delay
      setTimeout(() => {
        navigate(`/payment/${bookingRequest.id}`);
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Booking Request Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Your booking request has been submitted successfully. Redirecting you to the payment page...
            </p>
            <div className="animate-pulse mt-4">
              <p className="text-sm text-gray-500">Redirecting...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Book Your Stay</CardTitle>
        <CardDescription>Fill out the form below to request a booking at {hostel.name}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+256 7XX XXX XXX"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roomId">Room Type</Label>
            <Select 
              value={formData.roomId} 
              onValueChange={handleRoomSelect}
            >
              <SelectTrigger id="roomId" className={errors.roomId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.length > 0 ? (
                  availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.type.charAt(0).toUpperCase() + room.type.slice(1)} - {formatCurrency(room.price)}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No rooms available</SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="checkInDate">Check-in Date</Label>
            <Input
              id="checkInDate"
              name="checkInDate"
              type="date"
              value={formData.checkInDate}
              onChange={handleChange}
              min={getCurrentDate()}
              className={errors.checkInDate ? "border-red-500" : ""}
            />
            {errors.checkInDate && <p className="text-red-500 text-xs mt-1">{errors.checkInDate}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any special requests or requirements..."
              rows={3}
            />
          </div>
          
          <Separator />
          
          {selectedRoom && (
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Hostel:</span>
                  <span className="font-medium">{hostel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Room Type:</span>
                  <span className="font-medium capitalize">{selectedRoom.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Room Rate:</span>
                  <span className="font-medium">{formatCurrency(selectedRoom.price)}/semester</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Required Deposit:</span>
                  <span>{formatCurrency(depositAmount)}</span>
                </div>
              </div>
            </div>
          )}
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription className="text-xs">
              A deposit of 30% is required to confirm your booking. The remainder is due upon check-in.
              Your booking will be pending until deposit payment is received.
            </AlertDescription>
          </Alert>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Continue to Payment
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}