import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BookingRequest } from "@/lib/types";
import { getFromLocalStorage, formatCurrency } from "@/lib/utils";
import { Calendar, Home, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading bookings
    setIsLoading(true);
    
    setTimeout(() => {
      // In a real app, we'd call an API here
      // For demo purposes, we'll get data from localStorage
      const savedBookings = getFromLocalStorage<BookingRequest[]>("bookings", []);
      setBookings(savedBookings);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  const pendingBookings = bookings.filter(b => b.status === "pending");
  
  const getStatusIcon = (status: string) => {
    if (status === "confirmed") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Clock className="h-4 w-4 text-amber-500" />;
  };
  
  const renderBookingList = (filteredBookings: BookingRequest[]) => {
    if (filteredBookings.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="font-medium text-lg mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-4">
            You don't have any bookings in this category yet.
          </p>
          <Button asChild>
            <Link to="/hostels">Browse Hostels</Link>
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredBookings.map(booking => (
          <Card key={booking.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="p-4 flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="font-medium text-lg">Booking #{booking.id.slice(-8)}</h3>
                    <Badge className="w-fit flex items-center gap-1 mt-1 md:mt-0">
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Home className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Hostel ID</p>
                        <p>{booking.hostelId}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mt-0.5">
                        <path d="M2 12h20" />
                        <path d="M6 12v8" />
                        <path d="M18 12v8" />
                        <path d="M12 12v8" />
                        <path d="M4 4v4" />
                        <path d="M20 4v4" />
                        <path d="M12 4v4" />
                        <path d="M4 8h16" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Room Type</p>
                        <p className="capitalize">{booking.roomType}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Check-in Date</p>
                        <p>{booking.checkInDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Deposit Amount</p>
                      <p className="font-medium">{formatCurrency(booking.depositAmount)}</p>
                    </div>
                    
                    <div className="flex items-center mt-3 sm:mt-0">
                      {booking.depositPaid ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Paid</span>
                        </div>
                      ) : (
                        <Button size="sm" asChild>
                          <Link to={`/payment/${booking.id}`}>Pay Deposit</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="sm:w-32 border-t sm:border-t-0 sm:border-l border-gray-100">
                  <div className="h-full flex flex-col items-center justify-center p-4">
                    <Button variant="outline" size="sm" className="w-full mb-2" asChild>
                      <Link to={`/bookings/${booking.id}/confirmation`}>View</Link>
                    </Button>
                    
                    {booking.status === "pending" && (
                      <Button variant="ghost" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage and view all your hostel bookings
          </p>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-md p-4 w-full">
                <div className="animate-pulse space-y-4">
                  <div className="flex justify-between">
                    <div className="bg-gray-200 h-6 w-1/4 rounded-md"></div>
                    <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-4 w-3/4 rounded-md"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded-md"></div>
                    <div className="bg-gray-200 h-4 w-2/3 rounded-md"></div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <div className="bg-gray-200 h-6 w-1/4 rounded-md"></div>
                    <div className="bg-gray-200 h-8 w-24 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't made any hostel bookings yet. Start browsing our available hostels to find your perfect accommodation.
            </p>
            <Button size="lg" asChild>
              <Link to="/hostels">Browse Hostels</Link>
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Bookings ({bookings.length})</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {renderBookingList(bookings)}
            </TabsContent>
            
            <TabsContent value="confirmed" className="space-y-4">
              {renderBookingList(confirmedBookings)}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {renderBookingList(pendingBookings)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}