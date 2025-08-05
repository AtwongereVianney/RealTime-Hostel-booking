# Notification System Plan

## Overview
Implement a comprehensive notification system for the hostel booking platform using HTML, JavaScript, and Bootstrap with server-side processing in PHP.

## Key Features
1. Real-time notifications
2. Notification types (booking, payment, system)
3. Mark as read/unread functionality
4. Notification center
5. Email notifications (optional)
6. Push notifications (optional)

## Implementation Structure
- `frontend/notifications/index.php` - Notification center
- `frontend/notifications/view.php` - View notification details
- `backend/includes/notification_functions.php` - Notification processing functions
- `backend/cron/send_notifications.php` - Cron job for email notifications (optional)

## Implementation Details

### 1. Notification Center (`notifications/index.php`)

#### A. Features
1. List all notifications with filtering
2. Mark notifications as read
3. Delete notifications
4. Notification details view
5. Bulk actions

#### B. HTML Structure
```html
<div class="container-fluid">
    <div class="row">
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Notifications</h1>
                <div class="btn-toolbar mb-2 mb-md-0">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary" id="markAllRead">
                            <i class="fas fa-check-double"></i> Mark All Read
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" id="deleteAll">
                            <i class="fas fa-trash"></i> Delete All
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filter Section -->
            <div class="card mb-4">
                <div class="card-body">
                    <form method="GET" class="row g-3">
                        <div class="col-md-4">
                            <label for="type_filter" class="form-label">Notification Type</label>
                            <select class="form-select" id="type_filter" name="type">
                                <option value="">All Types</option>
                                <option value="booking" <?php echo ($_GET['type'] ?? '') === 'booking' ? 'selected' : ''; ?>>Booking</option>
                                <option value="payment" <?php echo ($_GET['type'] ?? '') === 'payment' ? 'selected' : ''; ?>>Payment</option>
                                <option value="system" <?php echo ($_GET['type'] ?? '') === 'system' ? 'selected' : ''; ?>>System</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label for="status_filter" class="form-label">Status</label>
                            <select class="form-select" id="status_filter" name="status">
                                <option value="">All Statuses</option>
                                <option value="unread" <?php echo ($_GET['status'] ?? '') === 'unread' ? 'selected' : ''; ?>>Unread</option>
                                <option value="read" <?php echo ($_GET['status'] ?? '') === 'read' ? 'selected' : ''; ?>>Read</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">&nbsp;</label>
                            <div>
                                <button type="submit" class="btn btn-primary">Filter</button>
                                <a href="index.php" class="btn btn-secondary">Reset</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Notifications List -->
            <?php if (count($notifications) > 0): ?>
                <div class="list-group">
                    <?php foreach ($notifications as $notification): ?>
                        <div class="list-group-item <?php echo !$notification['is_read'] ? 'list-group-item-info' : ''; ?>">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">
                                    <?php if (!$notification['is_read']): ?>
                                        <span class="badge bg-primary me-2">New</span>
                                    <?php endif; ?>
                                    <?php echo htmlspecialchars($notification['title']); ?>
                                </h5>
                                <small><?php echo date('M j, Y g:i A', strtotime($notification['created_at'])); ?></small>
                            </div>
                            <p class="mb-1"><?php echo htmlspecialchars($notification['message']); ?></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small>
                                    <span class="badge bg-<?php 
                                        echo $notification['type'] === 'booking' ? 'primary' : 
                                            ($notification['type'] === 'payment' ? 'success' : 'secondary'); 
                                    ?>">
                                        <?php echo ucfirst($notification['type']); ?>
                                    </span>
                                </small>
                                <div class="btn-group" role="group">
                                    <?php if (!empty($notification['action_url'])): ?>
                                        <a href="<?php echo $notification['action_url']; ?>" class="btn btn-sm btn-outline-primary">
                                            <i class="fas fa-external-link-alt"></i> View Details
                                        </a>
                                    <?php endif; ?>
                                    <?php if (!$notification['is_read']): ?>
                                        <a href="mark_read.php?id=<?php echo $notification['id']; ?>" class="btn btn-sm btn-outline-success">
                                            <i class="fas fa-check"></i> Mark Read
                                        </a>
                                    <?php else: ?>
                                        <a href="mark_unread.php?id=<?php echo $notification['id']; ?>" class="btn btn-sm btn-outline-secondary">
                                            <i class="fas fa-envelope"></i> Mark Unread
                                        </a>
                                    <?php endif; ?>
                                    <a href="delete.php?id=<?php echo $notification['id']; ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Are you sure you want to delete this notification?')">
                                        <i class="fas fa-trash"></i> Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                
                <!-- Pagination -->
                <?php if ($totalPages > 1): ?>
                    <nav aria-label="Notification list pagination" class="mt-4">
                        <ul class="pagination justify-content-center">
                            <?php if ($currentPage > 1): ?>
                                <li class="page-item">
                                    <a class="page-link" href="?page=<?php echo $currentPage - 1; ?>&<?php echo http_build_query($_GET); ?>">Previous</a>
                                </li>
                            <?php endif; ?>
                            
                            <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                                <li class="page-item <?php echo $i == $currentPage ? 'active' : ''; ?>">
                                    <a class="page-link" href="?page=<?php echo $i; ?>&<?php echo http_build_query($_GET); ?>"><?php echo $i; ?></a>
                                </li>
                            <?php endfor; ?>
                            
                            <?php if ($currentPage < $totalPages): ?>
                                <li class="page-item">
                                    <a class="page-link" href="?page=<?php echo $currentPage + 1; ?>&<?php echo http_build_query($_GET); ?>">Next</a>
                                </li>
                            <?php endif; ?>
                        </ul>
                    </nav>
                <?php endif; ?>
            <?php else: ?>
                <div class="text-center py-5">
                    <i class="fas fa-bell fa-3x text-muted mb-3"></i>
                    <h3>No notifications found</h3>
                    <p class="text-muted">You're all caught up!</p>
                </div>
            <?php endif; ?>
        </main>
    </div>
</div>
```

### 2. Notification Bell Component (for header)
```html
<!-- Notification Bell Dropdown -->
<li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="notificationsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-bell"></i>
        <?php if ($unreadCount > 0): ?>
            <span class="badge bg-danger"><?php echo $unreadCount; ?></span>
        <?php endif; ?>
    </a>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationsDropdown">
        <li><h6 class="dropdown-header">Notifications</h6></li>
        <?php if (count($recentNotifications) > 0): ?>
            <?php foreach ($recentNotifications as $notification): ?>
                <li>
                    <a class="dropdown-item <?php echo !$notification['is_read'] ? 'bg-info bg-opacity-10' : ''; ?>" href="notifications/view.php?id=<?php echo $notification['id']; ?>">
                        <div class="d-flex">
                            <div class="flex-shrink-0">
                                <i class="fas fa-<?php 
                                    echo $notification['type'] === 'booking' ? 'calendar-check' : 
                                        ($notification['type'] === 'payment' ? 'money-bill' : 'info-circle'); 
                                ?>"></i>
                            </div>
                            <div class="flex-grow-1 ms-2">
                                <h6 class="mb-0"><?php echo htmlspecialchars($notification['title']); ?></h6>
                                <small><?php echo htmlspecialchars($notification['message']); ?></small>
                                <div class="small text-muted"><?php echo date('M j, g:i A', strtotime($notification['created_at'])); ?></div>
                            </div>
                        </div>
                    </a>
                </li>
            <?php endforeach; ?>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-center" href="notifications/">View All Notifications</a></li>
        <?php else: ?>
            <li><a class="dropdown-item text-center" href="#">No new notifications</a></li>
        <?php endif; ?>
    </ul>
</li>
```

### 3. Database Operations

#### A. Create Notification
```php
function createNotification($userId, $title, $message, $type = 'system', $actionUrl = null) {
    global $conn;
    
    $userId = mysqli_real_escape_string($conn, $userId);
    $title = mysqli_real_escape_string($conn, $title);
    $message = mysqli_real_escape_string($conn, $message);
    $type = mysqli_real_escape_string($conn, $type);
    $actionUrl = $actionUrl ? "'" . mysqli_real_escape_string($conn, $actionUrl) . "'" : "NULL";
    
    $query = "INSERT INTO notifications (id, user_id, title, message, type, action_url, is_read, created_at) 
              VALUES (UUID(), '$userId', '$title', '$message', '$type', $actionUrl, 0, NOW())";
    
    return executeQuery($conn, $query);
}

// Example usage:
// Booking confirmation notification
createNotification(
    $userId, 
    'Booking Confirmed', 
    "Your booking at $hostelName has been confirmed!", 
    'booking', 
    "/bookings/view.php?id=$bookingId"
);

// Payment reminder notification
createNotification(
    $userId, 
    'Payment Reminder', 
    "Please complete your deposit payment for $hostelName", 
    'payment', 
    "/bookings/view.php?id=$bookingId"
);
```

#### B. Notification Management Queries
```php
// Get notifications with filtering
$notificationsQuery = "SELECT * FROM notifications 
                       WHERE user_id = '$userId'";

// Add filters
if (!empty($type)) {
    $notificationsQuery .= " AND type = '" . mysqli_real_escape_string($conn, $type) . "'";
}

if (!empty($status)) {
    $isRead = $status === 'read' ? 1 : 0;
    $notificationsQuery .= " AND is_read = $isRead";
}

$notificationsQuery .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";

// Count total notifications for pagination
$countQuery = "SELECT COUNT(*) as total FROM notifications 
               WHERE user_id = '$userId'";

// Add same filters as above

// Mark notification as read
$markReadQuery = "UPDATE notifications SET is_read = 1 WHERE id = '$notificationId' AND user_id = '$userId'";

// Mark all notifications as read
$markAllReadQuery = "UPDATE notifications SET is_read = 1 WHERE user_id = '$userId' AND is_read = 0";

// Delete notification
$deleteQuery = "DELETE FROM notifications WHERE id = '$notificationId' AND user_id = '$userId'";

// Delete all notifications
$deleteAllQuery = "DELETE FROM notifications WHERE user_id = '$userId'";

// Get unread count for notification bell
$unreadCountQuery = "SELECT COUNT(*) as unread_count FROM notifications 
                     WHERE user_id = '$userId' AND is_read = 0";

// Get recent notifications for dropdown
$recentNotificationsQuery = "SELECT * FROM notifications 
                             WHERE user_id = '$userId' 
                             ORDER BY created_at DESC LIMIT 5";
```

### 4. JavaScript Enhancements
- Real-time notification updates using AJAX
- Auto-refresh notification center
- Notification sounds (optional)
- Desktop notifications (optional)
- Mark multiple notifications as read
- Bulk delete functionality
- Smooth animations for new notifications

### 5. Email Notifications (Optional)
```php
// Function to send email notification
function sendEmailNotification($to, $subject, $message) {
    // Email configuration
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: noreply@hostelbooking.com' . "\r\n";
    
    // Send email
    return mail($to, $subject, $message, $headers);
}

// Example usage in notification creation
function createNotificationWithEmail($userId, $title, $message, $type = 'system', $actionUrl = null, $sendEmail = false) {
    global $conn;
    
    // Create database notification
    $result = createNotification($userId, $title, $message, $type, $actionUrl);
    
    // Send email if requested
    if ($sendEmail && $result) {
        // Get user email
        $userQuery = "SELECT email, name FROM users WHERE id = '$userId'";
        $userResult = executeQuery($conn, $userQuery);
        $user = mysqli_fetch_assoc($userResult);
        
        if ($user) {
            $emailSubject = APP_NAME . " - " . $title;
            $emailMessage = "
                <html>
                <body>
                    <h2>Hello {$user['name']},</h2>
                    <p>$message</p>
                    <p><a href='" . APP_URL . "$actionUrl'>View Details</a></p>
                    <p>Best regards,<br>The " . APP_NAME . " Team</p>
                </body>
                </html>
            ";
            
            sendEmailNotification($user['email'], $emailSubject, $emailMessage);
        }
    }
    
    return $result;
}
```

### 6. Security Considerations
- User-specific notification access
- Input validation and sanitization
- SQL injection prevention
- XSS prevention in notification content
- CSRF protection for notification actions

### 7. Performance Considerations
- Efficient database queries
- Pagination for large notification lists
- Caching of frequently accessed notifications
- Cleanup of old notifications (cron job)
- Indexing of notification table columns

### 8. Responsive Design
- Mobile-friendly notification center
- Adaptive notification dropdown
- Touch-friendly notification actions
- Optimized layout for different screen sizes

### 9. Integration Points
- User authentication system
- Booking system
- Payment system
- Email service
- Push notification service (optional)