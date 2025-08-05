import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { BookingRequest } from "@/lib/types";
import { formatCurrency, getFromLocalStorage, saveToLocalStorage } from "@/lib/utils";
import { CreditCard, Landmark, CheckCircle2, AlertCircle } from "lucide-react";

interface PaymentFormProps {
  booking: BookingRequest;
}

export function PaymentForm({ booking }: PaymentFormProps) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [mobileMoney, setMobileMoney] = useState({
    phoneNumber: "",
  });
  const [bankTransfer, setBankTransfer] = useState({
    accountName: "",
    reference: `REF-${booking.id}`,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const validatePaymentDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }
      
      if (!cardDetails.cardName.trim()) {
        newErrors.cardName = "Name on card is required";
      }
      
      if (!cardDetails.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
        newErrors.expiryDate = "Please use MM/YY format";
      }
      
      if (!cardDetails.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
    } else if (paymentMethod === "mobile") {
      if (!mobileMoney.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!/^\+?[0-9\s-]{7,15}$/.test(mobileMoney.phoneNumber)) {
        newErrors.phoneNumber = "Please enter a valid phone number";
      }
    } else if (paymentMethod === "bank") {
      if (!bankTransfer.accountName.trim()) {
        newErrors.accountName = "Account name is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMobileMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMobileMoney((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBankTransferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankTransfer((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const processPayment = () => {
    if (!validatePaymentDetails()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // In a real app, we would call a payment API here
      
      // For demo purposes: 80% chance of success, 20% chance of failure
      const isSuccessful = Math.random() < 0.8;
      
      if (isSuccessful) {
        // Update booking status
        const existingBookings = getFromLocalStorage<BookingRequest[]>("bookings", []);
        const updatedBookings = existingBookings.map(b => 
          b.id === booking.id ? { ...b, depositPaid: true, status: "confirmed" } : b
        );
        
        saveToLocalStorage("bookings", updatedBookings);
        
        setIsSuccess(true);
        setIsError(false);
        
        // Redirect to confirmation page after delay
        setTimeout(() => {
          navigate(`/bookings/${booking.id}/confirmation`);
        }, 2000);
      } else {
        setIsSuccess(false);
        setIsError(true);
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your payment of {formatCurrency(booking.depositAmount)} has been processed successfully.
            </p>
            <div className="animate-pulse mt-4">
              <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">
              We couldn't process your payment. Please try again or use a different payment method.
            </p>
            <Button onClick={() => setIsError(false)}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your deposit payment to confirm your booking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-medium mb-2">Payment Summary</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Booking Reference:</span>
              <span className="font-medium">{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Room Type:</span>
              <span className="font-medium capitalize">{booking.roomType}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Deposit Amount:</span>
              <span>{formatCurrency(booking.depositAmount)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Select Payment Method</Label>
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={setPaymentMethod} 
            className="grid grid-cols-3 gap-2"
          >
            <div>
              <RadioGroupItem 
                value="card" 
                id="card" 
                className="peer sr-only" 
              />
              <Label 
                htmlFor="card" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CreditCard className="mb-2 h-6 w-6" />
                Card
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="mobile" 
                id="mobile" 
                className="peer sr-only" 
              />
              <Label 
                htmlFor="mobile" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 h-6 w-6">
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
                Mobile
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="bank" 
                id="bank" 
                className="peer sr-only" 
              />
              <Label 
                htmlFor="bank" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Landmark className="mb-2 h-6 w-6" />
                Bank
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === "card" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input 
                id="cardNumber" 
                name="cardNumber" 
                placeholder="1234 5678 9012 3456" 
                value={cardDetails.cardNumber}
                onChange={handleCardDetailsChange}
                className={errors.cardNumber ? "border-red-500" : ""}
              />
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input 
                id="cardName" 
                name="cardName" 
                placeholder="John Smith" 
                value={cardDetails.cardName}
                onChange={handleCardDetailsChange}
                className={errors.cardName ? "border-red-500" : ""}
              />
              {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input 
                  id="expiryDate" 
                  name="expiryDate" 
                  placeholder="MM/YY" 
                  value={cardDetails.expiryDate}
                  onChange={handleCardDetailsChange}
                  className={errors.expiryDate ? "border-red-500" : ""}
                />
                {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv" 
                  name="cvv" 
                  type="password" 
                  placeholder="123" 
                  value={cardDetails.cvv}
                  onChange={handleCardDetailsChange}
                  className={errors.cvv ? "border-red-500" : ""}
                  maxLength={4}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>
          </div>
        )}
        
        {paymentMethod === "mobile" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Mobile Money Number</Label>
              <Input 
                id="phoneNumber" 
                name="phoneNumber" 
                placeholder="+256 7XX XXX XXX" 
                value={mobileMoney.phoneNumber}
                onChange={handleMobileMoneyChange}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
            
            <div className="rounded-md bg-amber-50 p-4 text-amber-800 text-sm">
              <p className="font-medium">How it works:</p>
              <ol className="list-decimal ml-4 mt-1 space-y-1">
                <li>Click "Pay Now" to initiate the mobile money payment</li>
                <li>You'll receive a prompt on your phone to confirm the payment</li>
                <li>Enter your mobile money PIN to complete the transaction</li>
              </ol>
            </div>
          </div>
        )}
        
        {paymentMethod === "bank" && (
          <div className="space-y-4">
            <div className="rounded-md bg-blue-50 p-4 text-blue-800 text-sm space-y-2">
              <p className="font-medium">Bank Transfer Details:</p>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-gray-600">Bank:</div>
                <div>Equity Bank Uganda</div>
                <div className="text-gray-600">Account Name:</div>
                <div>HostelHub Ltd</div>
                <div className="text-gray-600">Account Number:</div>
                <div>1234567890</div>
                <div className="text-gray-600">Reference:</div>
                <div>{bankTransfer.reference}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountName">Your Account Name</Label>
              <Input 
                id="accountName" 
                name="accountName" 
                placeholder="Name on your bank account" 
                value={bankTransfer.accountName}
                onChange={handleBankTransferChange}
                className={errors.accountName ? "border-red-500" : ""}
              />
              {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
            </div>
            
            <p className="text-sm text-gray-500">
              Please make sure to include the reference number in your bank transfer. Once we've confirmed receipt of your payment, your booking will be confirmed.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={processPayment} className="w-full" disabled={isProcessing}>
          {isProcessing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay ${formatCurrency(booking.depositAmount)} Now`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}