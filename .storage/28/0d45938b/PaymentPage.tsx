import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PaymentForm } from "@/components/hostel/PaymentForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingRequest } from "@/lib/types";
import { getFromLocalStorage } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!bookingId) return;
    
    const fetchBookingDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, we'd call an API here
        // For demo purposes, we'll get data from localStorage
        const bookings = getFromLocalStorage<BookingRequest[]>("bookings", []);
        const foundBooking = bookings.find(b => b.id === bookingId);
        
        if (!foundBooking) {
          setError("Booking not found");
          setIsLoading(false);
          return;
        }
        
        if (foundBooking.depositPaid) {
          setError("Payment already completed for this booking");
          setIsLoading(false);
          return;
        }
        
        setBooking(foundBooking);
      } catch (err) {
        setError("Failed to load booking details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleGoBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">
              Pay the deposit to secure your booking
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <Skeleton className="h-[600px] w-full max-w-md rounded-lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-red-500 mb-4">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6" />
                <path d="M9 9l6 6" />
              </svg>
              <h2 className="text-2xl font-semibold mb-2">{error}</h2>
              <p className="text-gray-600 mb-4">
                {error === "Payment already completed for this booking"
                  ? "You have already paid for this booking. View your booking details to check the status."
                  : "We couldn't find the booking you're looking for."
                }
              </p>
              <Button onClick={handleGoBack}>Go Back</Button>
            </div>
          ) : booking ? (
            <PaymentForm booking={booking} />
          ) : null}
        </div>
      </div>
    </Layout>
  );
}