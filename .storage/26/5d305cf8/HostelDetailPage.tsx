import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HostelDetail } from "@/components/hostel/HostelDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getHostelById, getHostelRooms } from "@/lib/data/hostels";
import { Hostel, Room } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

export default function HostelDetailPage() {
  const { hostelId } = useParams<{ hostelId: string }>();
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
        
        const fetchedRooms = getHostelRooms(hostelId);
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
  }, [hostelId]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hostels
          </Button>
          
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3">
                  <Skeleton className="h-[400px] w-full rounded-lg" />
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-20 w-32 rounded-md" />
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/3">
                  <Skeleton className="h-[500px] w-full rounded-lg" />
                </div>
              </div>
              
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-4">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6" />
                <path d="M9 9l6 6" />
              </svg>
              <h2 className="text-2xl font-semibold mb-2">{error}</h2>
              <p className="text-gray-600 mb-4">
                We couldn't find the hostel you're looking for.
              </p>
              <Button onClick={handleGoBack}>Go Back to Hostels</Button>
            </div>
          ) : hostel ? (
            <HostelDetail hostel={hostel} rooms={rooms} />
          ) : null}
        </div>
      </div>
    </Layout>
  );
}