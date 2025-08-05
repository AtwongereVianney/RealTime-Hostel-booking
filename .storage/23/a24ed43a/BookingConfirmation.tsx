import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { BookingRequest } from "@/lib/types";
import { getFromLocalStorage, formatCurrency } from "@/lib/utils";
import { CheckCircle2, Calendar, Home, User, Phone, Mail, CreditCard } from "lucide-react";

export default function BookingConfirmation() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch booking from localStorage
    const bookings = getFromLocalStorage<BookingRequest[]>("bookings", []);
    const foundBooking = bookings.find(b => b.id === bookingId);
    
    if (foundBooking) {
      setBooking(foundBooking);
    }
    setLoading(false);
  }, [bookingId]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h2 className="text-2xl font-semibold mb-2">Booking Not Found</h2>
                <p className="text-gray-600 mb-4">
                  We couldn't find any booking with the provided reference number.
                </p>
                <Button asChild>
                  <Link to="/hostels">Browse Hostels</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Booking Confirmation</CardTitle>
              <Badge className="bg-green-500">{booking.status}</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-2 py-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-medium">Your Booking is Confirmed!</h2>
              <p className="text-center text-gray-600 max-w-md">
                Your booking has been confirmed. We've sent a confirmation email to your email address.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Booking Details</h3>
              
              <div className="grid grid-cols-2 gap-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span>Booking Reference:</span>
                </div>
                <div className="font-medium">{booking.id}</div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5">
                    <Home className="h-4 w-4" />
                  </div>
                  <span>Room Type:</span>
                </div>
                <div className="font-medium capitalize">{booking.roomType} Room</div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span>Check-in Date:</span>
                </div>
                <div className="font-medium">{booking.checkInDate}</div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5">
                    <User className="h-4 w-4" />
                  </div>
                  <span>Name:</span>
                </div>
                <div className="font-medium">{booking.name}</div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>Phone:</span>
                </div>
                <div className="font-medium">{booking.phone}</div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>Email:</span>
                </div>
                <div className="font-medium">{booking.email}</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Payment Details</h3>
              
              <div className="grid grid-cols-2 gap-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <span>Deposit Amount:</span>
                </div>
                <div className="font-medium">{formatCurrency(booking.depositAmount)}</div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>Payment Status:</span>
                </div>
                <div className="font-medium">{booking.depositPaid ? "Paid" : "Pending"}</div>
              </div>
            </div>
            
            <div className="rounded-md bg-blue-50 p-4 text-blue-800 text-sm">
              <h4 className="font-medium mb-1">Next Steps</h4>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Keep this booking reference for your records.</li>
                <li>Please arrive with valid ID on your check-in date.</li>
                <li>Remainder of payment is due upon check-in.</li>
                <li>Contact the hostel directly if you have any questions or need to make changes to your booking.</li>
              </ol>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button className="w-full sm:w-auto" variant="outline" asChild>
              <Link to="/hostels">Browse More Hostels</Link>
            </Button>
            <Button className="w-full sm:w-auto" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}