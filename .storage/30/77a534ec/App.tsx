import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Hostel Pages
import HostelListPage from './pages/hostels/HostelListPage';
import HostelDetailPage from './pages/hostels/HostelDetailPage';
import BookingPage from './pages/hostels/BookingPage';
import BookingConfirmation from './pages/hostels/BookingConfirmation';
import PaymentPage from './pages/payment/PaymentPage';
import BookingsPage from './pages/user/BookingsPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Index />} />
          
          {/* Hostel Pages */}
          <Route path="/hostels" element={<HostelListPage />} />
          <Route path="/hostels/:hostelId" element={<HostelDetailPage />} />
          <Route path="/hostels/:hostelId/book" element={<BookingPage />} />
          
          {/* Booking & Payment Pages */}
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/bookings/:bookingId/confirmation" element={<BookingConfirmation />} />
          <Route path="/bookings" element={<BookingsPage />} />
          
          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
