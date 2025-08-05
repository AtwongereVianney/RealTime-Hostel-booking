# User Dashboard Pages Plan

## Overview
Create server-side rendered dashboard pages for students and hostel owners using HTML, JavaScript, and Bootstrap.

## Dashboard Structure
- `frontend/dashboard/student/index.php` - Student dashboard
- `frontend/dashboard/owner/index.php` - Hostel owner dashboard
- `frontend/dashboard/admin/index.php` - Admin dashboard (covered in separate plan)

## Student Dashboard Features
1. User profile information
2. Current and past bookings
3. Notifications
4. Quick actions
5. Account settings

## Hostel Owner Dashboard Features
1. Hostel management
2. Room management
3. Booking requests
4. Revenue statistics
5. Notifications

## Implementation Details

### 1. Student Dashboard (`dashboard/student/index.php`)

#### A. Page Sections
1. **Welcome Section**
   - Personalized greeting
   - Account status

2. **Booking Statistics**
   - Total bookings count
   - Active bookings count
   - Pending bookings count

3. **Recent Bookings**
   - Table of recent bookings with status
   - Links to view details

4. **Notifications**
   - Recent notifications list
   - Mark as read functionality

5. **Quick Actions**
   - Browse hostels
   - View all bookings
   - Account settings

#### B. HTML Structure
```html
<div class="container-fluid">
    <div class="row">
        <!-- Main Content -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Student Dashboard</h1>
                <div class="btn-toolbar mb-2 mb-md-0">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
                    </div>
                </div>
            </div>

            <!-- Booking Statistics -->
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Total Bookings</h5>
                            <h2><?php echo $stats['total_bookings']; ?></h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Active Bookings</h5>
                            <h2><?php echo $stats['active_bookings']; ?></h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Pending Bookings</h5>
                            <h2><?php echo $stats['pending_bookings']; ?></h2>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Bookings -->
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">Recent Bookings</h5>
                </div>
                <div class="card-body">
                    <?php if (count($recentBookings) > 0): ?>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Hostel</th>
                                        <th>Room</th>
                                        <th>Dates</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($recentBookings as $booking): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($booking['hostel_name']); ?></td>
                                            <td><?php echo htmlspecialchars($booking['room_number']); ?></td>
                                            <td><?php echo date('M j, Y', strtotime($booking['check_in_date'])); ?> - <?php echo date('M j, Y', strtotime($booking['check_out_date'])); ?></td>
                                            <td>
                                                <span class="badge bg-<?php echo $booking['status'] === 'confirmed' ? 'success' : ($booking['status'] === 'pending' ? 'warning' : 'secondary'); ?>">
                                                    <?php echo ucfirst($booking['status']); ?>
                                                </span>
                                            </td>
                                            <td>
                                                <a href="../bookings/view.php?id=<?php echo $booking['id']; ?>" class="btn btn-sm btn-primary">View</a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <p>No bookings found.</p>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Notifications -->
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Recent Notifications</h5>
                </div>
                <div class="card-body">
                    <?php if (count($notifications) > 0): ?>
                        <div class="list-group">
                            <?php foreach ($notifications as $notification): ?>
                                <div class="list-group-item <?php echo !$notification['is_read'] ? 'list-group-item-info' : ''; ?>">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h6 class="mb-1"><?php echo htmlspecialchars($notification['title']); ?></h6>
                                        <small><?php echo date('M j, Y g:i A', strtotime($notification['created_at'])); ?></small>
                                    </div>
                                    <p class="mb-1"><?php echo htmlspecialchars($notification['message']); ?></p>
                                    <?php if (!empty($notification['action_url'])): ?>
                                        <a href="<?php echo $notification['action_url']; ?>" class="btn btn-sm btn-outline-primary">View Details</a>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <p>No notifications found.</p>
                    <?php endif; ?>
                </div>
            </div>
        </main>

        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div class="position-sticky pt-3">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">
                            <i class="fas fa-home"></i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../bookings/">
                            <i class="fas fa-calendar-check"></i> My Bookings
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../profile/">
                            <i class="fas fa-user"></i> Profile
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../notifications/">
                            <i class="fas fa-bell"></i> Notifications
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
```

### 2. Hostel Owner Dashboard (`dashboard/owner/index.php`)

#### A. Page Sections
1. **Welcome Section**
   - Personalized greeting
   - Account status

2. **Hostel Statistics**
   - Total hostels managed
   - Total rooms
   - Available rooms
   - Occupied rooms

3. **Recent Bookings**
   - Table of recent bookings for owner's hostels
   - Booking status and actions

4. **Revenue Summary**
   - Monthly revenue
   - Pending payments
   - Chart visualization (optional)

5. **Quick Actions**
   - Add new hostel
   - Manage rooms
   - View all bookings
   - Account settings

#### B. HTML Structure
```html
<div class="container-fluid">
    <div class="row">
        <!-- Main Content -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Hostel Owner Dashboard</h1>
                <div class="btn-toolbar mb-2 mb-md-0">
                    <div class="btn-group me-2">
                        <a href="../hostels/create.php" class="btn btn-sm btn-primary">Add New Hostel</a>
                    </div>
                </div>
            </div>

            <!-- Hostel Statistics -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Total Hostels</h5>
                            <h2><?php echo $stats['total_hostels']; ?></h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Total Rooms</h5>
                            <h2><?php echo $stats['total_rooms']; ?></h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Available Rooms</h5>
                            <h2><?php echo $stats['available_rooms']; ?></h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Occupied Rooms</h5>
                            <h2><?php echo $stats['occupied_rooms']; ?></h2>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Bookings -->
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">Recent Bookings</h5>
                </div>
                <div class="card-body">
                    <?php if (count($recentBookings) > 0): ?>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Hostel</th>
                                        <th>Room</th>
                                        <th>Guest</th>
                                        <th>Dates</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($recentBookings as $booking): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($booking['hostel_name']); ?></td>
                                            <td><?php echo htmlspecialchars($booking['room_number']); ?></td>
                                            <td><?php echo htmlspecialchars($booking['guest_name']); ?></td>
                                            <td><?php echo date('M j, Y', strtotime($booking['check_in_date'])); ?> - <?php echo date('M j, Y', strtotime($booking['check_out_date'])); ?></td>
                                            <td>
                                                <span class="badge bg-<?php echo $booking['status'] === 'confirmed' ? 'success' : ($booking['status'] === 'pending' ? 'warning' : 'secondary'); ?>">
                                                    <?php echo ucfirst($booking['status']); ?>
                                                </span>
                                            </td>
                                            <td>
                                                <a href="../bookings/view.php?id=<?php echo $booking['id']; ?>" class="btn btn-sm btn-primary">View</a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <p>No bookings found.</p>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Quick Actions</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div class="card">
                                <div class="card-body text-center">
                                    <i class="fas fa-hotel fa-2x mb-2"></i>
                                    <h5>Manage Hostels</h5>
                                    <a href="../hostels/" class="btn btn-primary">View Hostels</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="card">
                                <div class="card-body text-center">
                                    <i class="fas fa-door-open fa-2x mb-2"></i>
                                    <h5>Manage Rooms</h5>
                                    <a href="../rooms/" class="btn btn-primary">View Rooms</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="card">
                                <div class="card-body text-center">
                                    <i class="fas fa-images fa-2x mb-2"></i>
                                    <h5>Manage Images</h5>
                                    <a href="../images/manage.php" class="btn btn-primary">View Images</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div class="position-sticky pt-3">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">
                            <i class="fas fa-home"></i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../hostels/">
                            <i class="fas fa-hotel"></i> My Hostels
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../bookings/">
                            <i class="fas fa-calendar-check"></i> Bookings
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../profile/">
                            <i class="fas fa-user"></i> Profile
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
```

### 3. Database Queries

#### Student Dashboard Queries
```php
// Booking statistics
$statsQuery = "SELECT 
                COUNT(*) as total_bookings,
                SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as active_bookings,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bookings
                FROM bookings WHERE user_id = '$userId'";

// Recent bookings
$bookingsQuery = "SELECT b.*, r.room_number, h.name as hostel_name 
                  FROM bookings b 
                  JOIN rooms r ON b.room_id = r.id 
                  JOIN hostels h ON r.hostel_id = h.id 
                  WHERE b.user_id = '$userId' 
                  ORDER BY b.created_at DESC LIMIT 5";

// Notifications
$notificationsQuery = "SELECT * FROM notifications 
                       WHERE user_id = '$userId' 
                       ORDER BY created_at DESC LIMIT 5";
```

#### Hostel Owner Dashboard Queries
```php
// Hostel statistics
$statsQuery = "SELECT 
                COUNT(*) as total_hostels,
                SUM(total_rooms) as total_rooms,
                SUM(available_rooms) as available_rooms,
                SUM(occupied_rooms) as occupied_rooms
                FROM (
                    SELECT h.id,
                           COUNT(r.id) as total_rooms,
                           SUM(CASE WHEN r.status = 'available' THEN 1 ELSE 0 END) as available_rooms,
                           SUM(CASE WHEN r.status = 'occupied' THEN 1 ELSE 0 END) as occupied_rooms
                    FROM hostels h
                    LEFT JOIN rooms r ON h.id = r.hostel_id
                    WHERE h.owner_id = '$ownerId'
                    GROUP BY h.id
                ) as hostel_stats";

// Recent bookings for owner's hostels
$bookingsQuery = "SELECT b.*, r.room_number, h.name as hostel_name, u.name as guest_name
                  FROM bookings b 
                  JOIN rooms r ON b.room_id = r.id 
                  JOIN hostels h ON r.hostel_id = h.id 
                  JOIN users u ON b.user_id = u.id
                  WHERE h.owner_id = '$ownerId' 
                  ORDER BY b.created_at DESC LIMIT 5";
```

### 4. JavaScript Enhancements
- Dynamic chart rendering for statistics (optional)
- Notification marking as read
- Quick action buttons
- Responsive sidebar toggle

### 5. Security Considerations
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- XSS prevention

### 6. Performance Considerations
- Efficient database queries
- Pagination for large datasets
- Caching of frequently accessed data
- Lazy loading for non-critical content

### 7. Responsive Design
- Mobile-friendly layout
- Collapsible sidebar
- Adaptive grid system
- Touch-friendly elements