# Hostel Detail Page Plan

## Overview
Create a server-side rendered hostel detail page with room information using HTML, JavaScript, and Bootstrap.

## Page Structure
- `frontend/hostels/view.php` - Hostel detail page
- `frontend/hostels/rooms.php` - Room listing for a hostel (optional, could be part of view.php)

## Features
1. Detailed hostel information
2. Image gallery
3. Room listings with availability
4. Contact information
5. Booking form
6. Reviews and ratings
7. Map location (optional)

## Implementation Details

### 1. Data Fetching
- Server-side database queries using mysqli
- Fetch hostel details by ID
- Fetch hostel images
- Fetch hostel amenities
- Fetch available rooms for the hostel
- Fetch reviews/ratings (if implemented)

### 2. Page Sections

#### A. Header Section
- Hostel name and location
- Rating and review count
- Price range information
- "Book Now" button

#### B. Image Gallery
- Main image display
- Thumbnail navigation
- Lightbox functionality (optional)

#### C. Hostel Description
- Detailed description
- Amenities list
- Contact information (phone, email, whatsapp)

#### D. Room Listings
- Table or card layout for rooms
- Room type, capacity, price
- Availability status
- "Book Room" buttons

#### E. Booking Form
- Date selection (check-in/check-out)
- Number of guests
- Special requests
- User information (if not logged in)

#### F. Reviews Section (optional)
- User reviews
- Rating display
- Review submission form

### 3. HTML Structure
```html
<div class="container mt-4">
    <!-- Hostel Header -->
    <div class="row">
        <div class="col-md-8">
            <h1><?php echo htmlspecialchars($hostel['name']); ?></h1>
            <p><i class="fas fa-map-marker-alt"></i> <?php echo htmlspecialchars($hostel['location']); ?></p>
            <div class="d-flex align-items-center">
                <div class="text-warning">
                    <?php for ($i = 1; $i <= 5; $i++): ?>
                        <?php if ($i <= $hostel['rating']): ?>
                            <i class="fas fa-star"></i>
                        <?php else: ?>
                            <i class="far fa-star"></i>
                        <?php endif; ?>
                    <?php endfor; ?>
                </div>
                <span class="ms-2">(<?php echo $hostel['reviews']; ?> reviews)</span>
            </div>
        </div>
        <div class="col-md-4 text-end">
            <h3><?php echo formatCurrency($hostel['price']); ?> <small class="text-muted">per semester</small></h3>
            <a href="#booking-form" class="btn btn-primary btn-lg">Book Now</a>
        </div>
    </div>

    <!-- Image Gallery -->
    <div class="row mt-4">
        <div class="col-md-12">
            <div id="hostelCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <?php foreach ($images as $index => $image): ?>
                        <div class="carousel-item <?php echo $index === 0 ? 'active' : ''; ?>">
                            <img src="<?php echo htmlspecialchars($image['image_path']); ?>" class="d-block w-100" alt="<?php echo htmlspecialchars($image['caption'] ?? $hostel['name']); ?>" style="height: 400px; object-fit: cover;">
                            <?php if (!empty($image['caption'])): ?>
                                <div class="carousel-caption d-none d-md-block">
                                    <p><?php echo htmlspecialchars($image['caption']); ?></p>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#hostelCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#hostelCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Hostel Details -->
    <div class="row mt-4">
        <div class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <h3>Description</h3>
                    <p><?php echo nl2br(htmlspecialchars($hostel['description'])); ?></p>
                    
                    <h3 class="mt-4">Amenities</h3>
                    <div>
                        <?php foreach ($amenities as $amenity): ?>
                            <span class="badge bg-secondary me-1 mb-1"><?php echo htmlspecialchars($amenity); ?></span>
                        <?php endforeach; ?>
                    </div>
                    
                    <h3 class="mt-4">Contact Information</h3>
                    <ul class="list-unstyled">
                        <?php if (!empty($hostel['contact_phone'])): ?>
                            <li><i class="fas fa-phone"></i> <?php echo htmlspecialchars($hostel['contact_phone']); ?></li>
                        <?php endif; ?>
                        <?php if (!empty($hostel['contact_email'])): ?>
                            <li><i class="fas fa-envelope"></i> <?php echo htmlspecialchars($hostel['contact_email']); ?></li>
                        <?php endif; ?>
                        <?php if (!empty($hostel['contact_whatsapp'])): ?>
                            <li><i class="fab fa-whatsapp"></i> <?php echo htmlspecialchars($hostel['contact_whatsapp']); ?></li>
                        <?php endif; ?>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h4>Quick Info</h4>
                    <ul class="list-unstyled">
                        <li><strong>Total Rooms:</strong> <?php echo $hostel['total_rooms']; ?></li>
                        <li><strong>Available Rooms:</strong> <?php echo $hostel['available_rooms']; ?></li>
                        <li><strong>Owner:</strong> <?php echo htmlspecialchars($hostel['owner_name']); ?></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Room Listings -->
    <div class="row mt-4">
        <div class="col-md-12">
            <h2>Available Rooms</h2>
            <div class="row">
                <?php foreach ($rooms as $room): ?>
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title"><?php echo ucfirst($room['type']); ?> Room</h5>
                                <p class="card-text">
                                    <strong>Room Number:</strong> <?php echo htmlspecialchars($room['room_number']); ?><br>
                                    <strong>Capacity:</strong> <?php echo $room['capacity']; ?> people<br>
                                    <strong>Price:</strong> <?php echo formatCurrency($room['price']); ?> per semester
                                </p>
                                <p class="card-text"><?php echo nl2br(htmlspecialchars($room['description'])); ?></p>
                                <div class="d-grid">
                                    <?php if ($room['status'] === 'available'): ?>
                                        <a href="../bookings/create.php?room_id=<?php echo $room['id']; ?>" class="btn btn-primary">Book This Room</a>
                                    <?php else: ?>
                                        <button class="btn btn-secondary" disabled>Not Available</button>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <!-- Booking Form -->
    <div class="row mt-4" id="booking-form">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h3>Book a Room</h3>
                </div>
                <div class="card-body">
                    <form method="POST" action="../bookings/create.php">
                        <input type="hidden" name="hostel_id" value="<?php echo $hostel['id']; ?>">
                        <div class="mb-3">
                            <label for="room_id" class="form-label">Select Room</label>
                            <select class="form-select" name="room_id" required>
                                <option value="">Choose a room</option>
                                <?php foreach ($availableRooms as $room): ?>
                                    <option value="<?php echo $room['id']; ?>">
                                        <?php echo ucfirst($room['type']); ?> Room - <?php echo formatCurrency($room['price']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="check_in_date" class="form-label">Check-in Date</label>
                                    <input type="date" class="form-control" name="check_in_date" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="check_out_date" class="form-label">Check-out Date</label>
                                    <input type="date" class="form-control" name="check_out_date" required>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="special_requests" class="form-label">Special Requests</label>
                            <textarea class="form-control" name="special_requests" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn btn-success">Proceed to Booking</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
```

### 4. Database Queries
```php
// Fetch hostel details
$hostelQuery = "SELECT h.*, u.name as owner_name,
                       COUNT(DISTINCT r.id) as total_rooms,
                       COUNT(DISTINCT CASE WHEN r.status = 'available' THEN r.id END) as available_rooms
                FROM hostels h
                LEFT JOIN users u ON h.owner_id = u.id
                LEFT JOIN rooms r ON h.id = r.hostel_id
                WHERE h.id = '$hostelId' AND h.status = 'active'
                GROUP BY h.id";

// Fetch hostel images
$imagesQuery = "SELECT * FROM hostel_images WHERE hostel_id = '$hostelId' ORDER BY is_main DESC, created_at ASC";

// Fetch hostel amenities
$amenitiesQuery = "SELECT amenity FROM hostel_amenities WHERE hostel_id = '$hostelId'";

// Fetch rooms for this hostel
$roomsQuery = "SELECT * FROM rooms WHERE hostel_id = '$hostelId' ORDER BY room_number";

// Fetch available rooms for booking form
$availableRoomsQuery = "SELECT * FROM rooms WHERE hostel_id = '$hostelId' AND status = 'available' ORDER BY price";
```

### 5. JavaScript Enhancements
- Image gallery navigation
- Date picker validation
- Real-time price calculation
- Form validation
- Dynamic room selection based on dates

### 6. Responsive Design
- Mobile-friendly image gallery
- Collapsible sections on small screens
- Touch-friendly elements
- Adaptive layout for different screen sizes

### 7. Security Considerations
- Input validation for hostel ID
- SQL injection prevention
- XSS prevention with htmlspecialchars
- Access control for editing (if implemented)

### 8. Performance Considerations
- Efficient database queries
- Image optimization
- Lazy loading for images
- Caching of static content