# Booking Functionality Plan

## Overview
Implement a complete booking system for the hostel booking platform using HTML, JavaScript, and Bootstrap with server-side processing in PHP.

## Booking Flow
1. User selects hostel and room
2. User fills booking form (dates, personal info if not logged in)
3. System validates availability
4. User confirms booking details
5. System creates booking record
6. User receives confirmation

## Key Pages
- `frontend/bookings/create.php` - Booking form
- `frontend/bookings/confirm.php` - Booking confirmation
- `frontend/bookings/view.php` - View booking details
- `frontend/bookings/manage.php` - Manage user bookings

## Implementation Details

### 1. Booking Creation Process

#### A. Booking Form (`bookings/create.php`)
- Pre-filled form if room_id is provided in URL
- Date selection with validation
- User information (if not logged in)
- Special requests field
- Terms and conditions acceptance
- Price calculation display

#### B. Form Validation
- Date validation (check-in before check-out)
- Room availability check
- User information validation (if required)
- Terms acceptance validation

#### C. Booking Confirmation (`bookings/confirm.php`)
- Display booking summary
- Final price calculation
- Payment options display
- Confirmation button

#### D. Booking Storage
- Insert booking record into database
- Update room status to "occupied" or "booked"
- Create notification for user and hostel owner
- Send confirmation email (optional)

### 2. HTML Structure

#### Booking Form
```html
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h2>Book Your Room</h2>
                </div>
                <div class="card-body">
                    <?php if ($error): ?>
                        <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
                    <?php endif; ?>
                    
                    <form method="POST" action="confirm.php">
                        <input type="hidden" name="room_id" value="<?php echo htmlspecialchars($room['id']); ?>">
                        
                        <!-- Room Information -->
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5><?php echo htmlspecialchars($room['hostel_name']); ?></h5>
                                <p><?php echo ucfirst($room['type']); ?> Room - <?php echo htmlspecialchars($room['room_number']); ?></p>
                                <p class="fw-bold"><?php echo formatCurrency($room['price']); ?> per semester</p>
                            </div>
                        </div>
                        
                        <!-- Booking Dates -->
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="check_in_date" class="form-label">Check-in Date</label>
                                    <input type="date" class="form-control" name="check_in_date" id="check_in_date" required value="<?php echo htmlspecialchars($_POST['check_in_date'] ?? ''); ?>">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="check_out_date" class="form-label">Check-out Date</label>
                                    <input type="date" class="form-control" name="check_out_date" id="check_out_date" required value="<?php echo htmlspecialchars($_POST['check_out_date'] ?? ''); ?>">
                                </div>
                            </div>
                        </div>
                        
                        <!-- User Information (if not logged in) -->
                        <?php if (!$isLoggedIn): ?>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="user_name" class="form-label">Full Name</label>
                                        <input type="text" class="form-control" name="user_name" id="user_name" required value="<?php echo htmlspecialchars($_POST['user_name'] ?? ''); ?>">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="user_email" class="form-label">Email Address</label>
                                        <input type="email" class="form-control" name="user_email" id="user_email" required value="<?php echo htmlspecialchars($_POST['user_email'] ?? ''); ?>">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="user_phone" class="form-label">Phone Number</label>
                                        <input type="tel" class="form-control" name="user_phone" id="user_phone" required value="<?php echo htmlspecialchars($_POST['user_phone'] ?? ''); ?>">
                                    </div>
                                </div>
                            </div>
                        <?php endif; ?>
                        
                        <!-- Special Requests -->
                        <div class="mb-3">
                            <label for="special_requests" class="form-label">Special Requests</label>
                            <textarea class="form-control" name="special_requests" id="special_requests" rows="3"><?php echo htmlspecialchars($_POST['special_requests'] ?? ''); ?></textarea>
                        </div>
                        
                        <!-- Terms and Conditions -->
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" name="terms_accepted" id="terms_accepted" required>
                            <label class="form-check-label" for="terms_accepted">
                                I agree to the <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal">Terms and Conditions</a>
                            </label>
                        </div>
                        
                        <!-- Price Summary -->
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5>Price Summary</h5>
                                <table class="table">
                                    <tr>
                                        <td>Room Price (per semester)</td>
                                        <td class="text-end"><?php echo formatCurrency($room['price']); ?></td>
                                    </tr>
                                    <tr>
                                        <td>Deposit Required</td>
                                        <td class="text-end"><?php echo formatCurrency($room['price'] * 0.3); ?></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total Amount</strong></td>
                                        <td class="text-end"><strong><?php echo formatCurrency($room['price']); ?></strong></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-primary btn-lg">Proceed to Confirmation</button>
                            <a href="../hostels/view.php?id=<?php echo $room['hostel_id']; ?>" class="btn btn-secondary">Back to Hostel</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Terms and Conditions Modal -->
<div class="modal fade" id="termsModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Terms and Conditions</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>Detailed terms and conditions content...</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
```

### 3. Database Operations

#### Create Booking
```php
// Validate room availability
$availabilityQuery = "SELECT * FROM rooms 
                      WHERE id = '$roomId' 
                      AND status = 'available'
                      AND id NOT IN (
                          SELECT room_id FROM bookings 
                          WHERE room_id = '$roomId' 
                          AND (
                              (check_in_date <= '$checkOutDate' AND check_out_date >= '$checkInDate')
                          )
                      )";

// Insert booking record
$insertQuery = "INSERT INTO bookings (id, room_id, user_id, check_in_date, check_out_date, total_amount, deposit_amount, status) 
                VALUES ('$bookingId', '$roomId', '$userId', '$checkInDate', '$checkOutDate', $totalAmount, $depositAmount, 'pending')";

// Update room status
$updateRoomQuery = "UPDATE rooms SET status = 'booked' WHERE id = '$roomId'";
```

### 4. Booking Confirmation Page
```html
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header text-center">
                    <h2>Booking Confirmation</h2>
                </div>
                <div class="card-body">
                    <div class="text-center mb-4">
                        <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                        <h3 class="mt-3">Booking Successful!</h3>
                        <p>Your booking has been confirmed. Booking ID: <strong><?php echo $booking['id']; ?></strong></p>
                    </div>
                    
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5>Booking Details</h5>
                            <table class="table">
                                <tr>
                                    <td><strong>Hostel</strong></td>
                                    <td><?php echo htmlspecialchars($booking['hostel_name']); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>Room</strong></td>
                                    <td><?php echo htmlspecialchars($booking['room_number']); ?> (<?php echo ucfirst($booking['room_type']); ?>)</td>
                                </tr>
                                <tr>
                                    <td><strong>Check-in Date</strong></td>
                                    <td><?php echo date('F j, Y', strtotime($booking['check_in_date'])); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>Check-out Date</strong></td>
                                    <td><?php echo date('F j, Y', strtotime($booking['check_out_date'])); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>Total Amount</strong></td>
                                    <td><?php echo formatCurrency($booking['total_amount']); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>Deposit Required</strong></td>
                                    <td><?php echo formatCurrency($booking['deposit_amount']); ?></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <div class="alert alert-info">
                        <h5>Next Steps</h5>
                        <ol>
                            <li>Make your deposit payment of <?php echo formatCurrency($booking['deposit_amount']); ?> within 48 hours to secure your booking.</li>
                            <li>You will receive a payment confirmation email with payment instructions.</li>
                            <li>Check your email for your booking confirmation and receipt.</li>
                        </ol>
                    </div>
                    
                    <div class="d-grid gap-2">
                        <a href="view.php?id=<?php echo $booking['id']; ?>" class="btn btn-primary">View Booking Details</a>
                        <a href="../dashboard/student/" class="btn btn-secondary">Go to Dashboard</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

### 5. JavaScript Enhancements
- Date picker with min/max constraints
- Real-time price calculation
- Form validation
- Dynamic deposit calculation
- Availability checking without page reload (AJAX)

### 6. Security Considerations
- CSRF protection
- Input validation and sanitization
- SQL injection prevention
- XSS prevention
- Rate limiting for booking attempts

### 7. Error Handling
- Room not available
- Invalid dates
- Database errors
- Payment processing errors
- User authentication issues

### 8. Performance Considerations
- Efficient database queries
- Caching of frequently accessed data
- Optimized booking availability checks
- Asynchronous operations where appropriate

### 9. Integration Points
- User authentication system
- Notification system
- Payment processing (if implemented)
- Email notifications