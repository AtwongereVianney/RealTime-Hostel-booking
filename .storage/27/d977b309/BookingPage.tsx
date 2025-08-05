import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BookingForm } from "@/components/hostel/BookingForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getHostelById, getHostelRooms } from "@/lib/data/hostels";
import { Hostel, Room } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

export default function BookingPage() {
  const { hostelId } = useParams<{ hostelId: string }>();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const navigate = useNavigate();
  
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!hostelId) return;
    
    const fetchHostelDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const fetchedHostel = getHostelById(hostelId);
        if (!fetchedHostel) {
          setError("Hostel not found");
          setIsLoading(false);
          return;
        }
        
        const fetchedRooms = getHostelRooms(hostelId).filter(room => room.status === "available");
        if (fetchedRooms.length === 0) {
          setError("No rooms available for this hostel");
          setIsLoading(false);
          return;
        }
        
        // Validate room ID if provided
        if (roomId && !fetchedRooms.some(room => room.id === roomId)) {
          setError("Selected room is not available");
          setIsLoading(false);
          return;
        }
        
        setHostel(fetchedHostel);
        setRooms(fetchedRooms);
      } catch (err) {
        setError("Failed to load hostel details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHostelDetails();
  }, [hostelId, roomId]);
  
  const handleGoBack = () => {
    navigate(`/hostels/${hostelId}`);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleGoBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hostel Details
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Your Stay</h1>
            {!isLoading && hostel && (
              <p className="text-gray-600">
                Complete your booking at {hostel.name}
              </p>
            )}
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
                {error === "No rooms available for this hostel"
                  ? "There are no available rooms for booking at this hostel right now."
                  : "We couldn't process your booking request at this time."
                }
              </p>
              <Button onClick={handleGoBack}>Go Back to Hostel Details</Button>
            </div>
          ) : hostel ? (
            <BookingForm hostel={hostel} rooms={rooms} preselectedRoomId={roomId || undefined} />
          ) : null}
        </div>
      </div>
    </Layout>
  );
}