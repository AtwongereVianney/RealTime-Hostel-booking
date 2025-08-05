import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HostelCard } from '@/components/hostel/HostelCard';
import { HostelFilter } from '@/components/hostel/HostelFilter';
import { Hostel, FilterOptions } from '@/lib/types';
import { hostels, filterHostels } from '@/lib/data/hostels';

export default function HostelListPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [filteredHostels, setFilteredHostels] = useState<Hostel[]>(hostels);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const maxPrice = Math.max(...hostels.map(hostel => hostel.price));
  
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = [...hostels];
      
      // Apply search query if it exists
      if (initialSearch) {
        const searchLower = initialSearch.toLowerCase();
        filtered = filtered.filter(hostel => 
          hostel.name.toLowerCase().includes(searchLower) || 
          hostel.location.toLowerCase().includes(searchLower) ||
          hostel.amenities.some(amenity => amenity.toLowerCase().includes(searchLower))
        );
      }
      
      setFilteredHostels(filtered);
      setIsLoading(false);
    }, 500);
  }, [initialSearch]);
  
  const handleFilterChange = (filters: FilterOptions) => {
    setIsLoading(true);
    setActiveFilters(filters);
    
    // Simulate API call delay
    setTimeout(() => {
      const filtered = filterHostels(hostels, filters);
      setFilteredHostels(filtered);
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="sticky top-24">
              <HostelFilter onFilterChange={handleFilterChange} maxPrice={maxPrice} />
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Student Hostels</h1>
              <p className="text-gray-600">
                {isLoading 
                  ? 'Finding the best accommodations for you...'
                  : `Found ${filteredHostels.length} hostels${initialSearch ? ` matching "${initialSearch}"` : ''}`
                }
              </p>
            </div>
            
            {/* Hostel listings */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="border rounded-md p-4 h-[350px]">
                    <div className="animate-pulse flex flex-col h-full">
                      <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                      <div className="bg-gray-200 h-4 rounded-md w-3/4 mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded-md w-1/2 mb-4"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="bg-gray-200 h-6 rounded-md w-16"></div>
                        <div className="bg-gray-200 h-6 rounded-md w-16"></div>
                        <div className="bg-gray-200 h-6 rounded-md w-16"></div>
                      </div>
                      <div className="bg-gray-200 h-4 rounded-md w-1/3 mt-auto mb-2"></div>
                      <div className="flex gap-2 mt-2">
                        <div className="bg-gray-200 h-8 rounded-md w-1/2"></div>
                        <div className="bg-gray-200 h-8 rounded-md w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredHostels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHostels.map((hostel) => (
                  <HostelCard key={hostel.id} hostel={hostel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  <line x1="4" y1="4" x2="20" y2="20"></line>
                </svg>
                <h2 className="text-xl font-semibold mb-2">No Hostels Found</h2>
                <p className="text-gray-600">
                  We couldn't find any hostels matching your filters. Please try different criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}