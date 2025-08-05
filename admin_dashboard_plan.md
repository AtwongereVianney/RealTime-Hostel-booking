# Admin Dashboard Plan

## Overview
Create a server-side rendered admin dashboard with comprehensive management features using HTML, JavaScript, and Bootstrap.

## Dashboard Structure
- `frontend/dashboard/admin/index.php` - Main admin dashboard
- `frontend/dashboard/admin/users.php` - User management
- `frontend/dashboard/admin/hostels.php` - Hostel management
- `frontend/dashboard/admin/bookings.php` - Booking management
- `frontend/dashboard/admin/reports.php` - System reports
- `frontend/dashboard/admin/settings.php` - System settings

## Admin Dashboard Features
1. System overview and statistics
2. User management
3. Hostel and room management
4. Booking management
5. System reports and analytics
6. Notifications
7. System settings

## Implementation Details

### 1. Main Admin Dashboard (`dashboard/admin/index.php`)

#### A. Page Sections
1. **Welcome Section**
   - Personalized greeting
   - System status

2. **System Statistics**
   - Total users
   - Total hostels
   - Total rooms
   - Total bookings
   - Revenue summary

3. **Recent Activity**
   - Recent user registrations
   - Recent bookings
   - System notifications

4. **Quick Actions**
   - Manage users
   - Manage hostels
   - View bookings
   - System reports

#### B. HTML Structure
```html
<div class="container-fluid">
    <div class="row">
        <!-- Main Content -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Admin Dashboard</h1>
                <div class="btn-toolbar mb-2 mb-md-0">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary">Generate Report</button>
                    </div>
                </div>
            </div>

            <!-- System Statistics -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h5 class="card-title">Total Users</h5>
                                    <h2><?php echo $stats['total_users']; ?></h2>
                                </div>
                                <div class="text-primary">
                                    <i class="fas fa-users fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h5 class="card-title">Total Hostels</h5>
                                    <h2><?php echo $stats['total_hostels']; ?></h2>
                                </div>
                                <div class="text-success">
                                    <i class="fas fa-hotel fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h5 class="card-title">Total Rooms</h5>
                                    <h2><?php echo $stats['total_rooms']; ?></h2>
                                </div>
                                <div class="text-info">
                                    <i class="fas fa-door-open fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h5 class="card-title">Total Bookings</h5>
                                    <h2><?php echo $stats['total_bookings']; ?></h2>
                                </div>
                                <div class="text-warning">
                                    <i class="fas fa-calendar-check fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Revenue Summary -->
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Revenue Summary</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="text-center">
                                        <h3><?php echo formatCurrency($revenue['total']); ?></h3>
                                        <p>Total Revenue</p>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-center">
                                        <h3><?php echo formatCurrency($revenue['this_month']); ?></h3>
                                        <p>This Month</p>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-center">
                                        <h3><?php echo formatCurrency($revenue['pending']); ?></h3>
                                        <p>Pending Payments</p>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-center">
                                        <h3><?php echo formatCurrency($revenue['completed']); ?></h3>
                                        <p>Completed Payments</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Recent Users</h5>
                        </div>
                        <div class="card-body">
                            <?php if (count($recentUsers) > 0): ?>
                                <div class="table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Registered</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($recentUsers as $user): ?>
                                                <tr>
                                                    <td><?php echo htmlspecialchars($user['name']); ?></td>
                                                    <td><?php echo htmlspecialchars($user['email']); ?></td>
                                                    <td>
                                                        <span class="badge bg-<?php echo $user['role'] === 'admin' ? 'danger' : ($user['role'] === 'hostel_owner' ? 'warning' : 'primary'); ?>">
                                                            <?php echo ucfirst(str_replace('_', ' ', $user['role'])); ?>
                                                        </span>
                                                    </td>
                                                    <td><?php echo date('M j, Y', strtotime($user['created_at'])); ?></td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php else: ?>
                                <p>No recent users found.</p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
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
                                                <th>Guest</th>
                                                <th>Dates</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($recentBookings as $booking): ?>
                                                <tr>
                                                    <td><?php echo htmlspecialchars($booking['hostel_name']); ?></td>
                                                    <td><?php echo htmlspecialchars($booking['guest_name']); ?></td>
                                                    <td><?php echo date('M j', strtotime($booking['check_in_date'])); ?> - <?php echo date('M j', strtotime($booking['check_out_date'])); ?></td>
                                                    <td><?php echo formatCurrency($booking['total_amount']); ?></td>
                                                    <td>
                                                        <span class="badge bg-<?php echo $booking['status'] === 'confirmed' ? 'success' : ($booking['status'] === 'pending' ? 'warning' : 'secondary'); ?>">
                                                            <?php echo ucfirst($booking['status']); ?>
                                                        </span>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php else: ?>
                                <p>No recent bookings found.</p>
                            <?php endif; ?>
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
                        <a class="nav-link" href="users.php">
                            <i class="fas fa-users"></i> Users
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="hostels.php">
                            <i class="fas fa-hotel"></i> Hostels
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="bookings.php">
                            <i class="fas fa-calendar-check"></i> Bookings
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="reports.php">
                            <i class="fas fa-chart-bar"></i> Reports
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="settings.php">
                            <i class="fas fa-cog"></i> Settings
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
```

### 2. User Management (`dashboard/admin/users.php`)

#### A. Features
1. List all users with filtering
2. User details view
3. User creation/editing
4. User activation/deactivation
5. Role assignment

#### B. HTML Structure
```html
<div class="container-fluid">
    <div class="row">
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">User Management</h1>
                <div class="btn-toolbar mb-2 mb-md-0">
                    <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">
                        <i class="fas fa-plus"></i> Add User
                    </button>
                </div>
            </div>

            <!-- Filter Section -->
            <div class="card mb-4">
                <div class="card-body">
                    <form method="GET" class="row g-3">
                        <div class="col-md-4">
                            <label for="search" class="form-label">Search</label>
                            <input type="text" class="form-control" id="search" name="search" value="<?php echo htmlspecialchars($_GET['search'] ?? ''); ?>" placeholder="Name or email">
                        </div>
                        <div class="col-md-3">
                            <label for="role" class="form-label">Role</label>
                            <select class="form-select" id="role" name="role">
                                <option value="">All Roles</option>
                                <option value="student" <?php echo ($_GET['role'] ?? '') === 'student' ? 'selected' : ''; ?>>Student</option>
                                <option value="hostel_owner" <?php echo ($_GET['role'] ?? '') === 'hostel_owner' ? 'selected' : ''; ?>>Hostel Owner</option>
                                <option value="admin" <?php echo ($_GET['role'] ?? '') === 'admin' ? 'selected' : ''; ?>>Admin</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="status" class="form-label">Status</label>
                            <select class="form-select" id="status" name="status">
                                <option value="">All Statuses</option>
                                <option value="active" <?php echo ($_GET['status'] ?? '') === 'active' ? 'selected' : ''; ?>>Active</option>
                                <option value="inactive" <?php echo ($_GET['status'] ?? '') === 'inactive' ? 'selected' : ''; ?>>Inactive</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">&nbsp;</label>
                            <div>
                                <button type="submit" class="btn btn-primary">Filter</button>
                                <a href="users.php" class="btn btn-secondary">Reset</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Users Table -->
            <div class="card">
                <div class="card-body">
                    <?php if (count($users) > 0): ?>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Registered</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($users as $user): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($user['name']); ?></td>
                                            <td><?php echo htmlspecialchars($user['email']); ?></td>
                                            <td><?php echo htmlspecialchars($user['phone']); ?></td>
                                            <td>
                                                <span class="badge bg-<?php echo $user['role'] === 'admin' ? 'danger' : ($user['role'] === 'hostel_owner' ? 'warning' : 'primary'); ?>">
                                                    <?php echo ucfirst(str_replace('_', ' ', $user['role'])); ?>
                                                </span>
                                            </td>
                                            <td>
                                                <span class="badge bg-<?php echo $user['status'] === 'active' ? 'success' : 'secondary'; ?>">
                                                    <?php echo ucfirst($user['status']); ?>
                                                </span>
                                            </td>
                                            <td><?php echo date('M j, Y', strtotime($user['created_at'])); ?></td>
                                            <td>
                                                <div class="btn-group" role="group">
                                                    <a href="view_user.php?id=<?php echo $user['id']; ?>" class="btn btn-sm btn-outline-primary" title="View">
                                                        <i class="fas fa-eye"></i>
                                                    </a>
                                                    <a href="edit_user.php?id=<?php echo $user['id']; ?>" class="btn btn-sm btn-outline-secondary" title="Edit">
                                                        <i class="fas fa-edit"></i>
                                                    </a>
                                                    <?php if ($user['status'] === 'active'): ?>
                                                        <a href="deactivate_user.php?id=<?php echo $user['id']; ?>" class="btn btn-sm btn-outline-danger" title="Deactivate" onclick="return confirm('Are you sure you want to deactivate this user?')">
                                                            <i class="fas fa-times"></i>
                                                        </a>
                                                    <?php else: ?>
                                                        <a href="activate_user.php?id=<?php echo $user['id']; ?>" class="btn btn-sm btn-outline-success" title="Activate">
                                                            <i class="fas fa-check"></i>
                                                        </a>
                                                    <?php endif; ?>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Pagination -->
                        <?php if ($totalPages > 1): ?>
                            <nav aria-label="User list pagination">
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
                        <p>No users found.</p>
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>
</div>
```

### 3. Database Queries

#### Admin Dashboard Queries
```php
// System statistics
$statsQuery = "SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM hostels) as total_hostels,
                (SELECT COUNT(*) FROM rooms) as total_rooms,
                (SELECT COUNT(*) FROM bookings) as total_bookings";

// Revenue summary
$revenueQuery = "SELECT 
                SUM(total_amount) as total,
                SUM(CASE WHEN MONTH(created_at) = MONTH(NOW()) THEN total_amount ELSE 0 END) as this_month,
                SUM(CASE WHEN payment_status = 'pending' THEN total_amount ELSE 0 END) as pending,
                SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as completed
                FROM bookings";

// Recent users
$usersQuery = "SELECT * FROM users ORDER BY created_at DESC LIMIT 5";

// Recent bookings
$bookingsQuery = "SELECT b.*, h.name as hostel_name, u.name as guest_name
                  FROM bookings b
                  JOIN hostels h ON b.room_id = h.id
                  JOIN users u ON b.user_id = u.id
                  ORDER BY b.created_at DESC LIMIT 5";
```

#### User Management Queries
```php
// Filtered user list with pagination
$usersQuery = "SELECT * FROM users WHERE 1=1";

// Add filters
if (!empty($search)) {
    $usersQuery .= " AND (name LIKE '%" . mysqli_real_escape_string($conn, $search) . "%' OR email LIKE '%" . mysqli_real_escape_string($conn, $search) . "%')";
}

if (!empty($role)) {
    $usersQuery .= " AND role = '" . mysqli_real_escape_string($conn, $role) . "'";
}

if (!empty($status)) {
    $usersQuery .= " AND status = '" . mysqli_real_escape_string($conn, $status) . "'";
}

$usersQuery .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";

// Count total users for pagination
$countQuery = "SELECT COUNT(*) as total FROM users WHERE 1=1";

// Add same filters as above
```

### 4. JavaScript Enhancements
- Dynamic filtering without page reload (AJAX)
- Modal forms for user creation/editing
- Confirmation dialogs for destructive actions
- Data export functionality
- Chart visualization for reports

### 5. Security Considerations
- Admin role verification
- Input validation and sanitization
- SQL injection prevention
- XSS prevention
- CSRF protection for forms

### 6. Performance Considerations
- Efficient database queries
- Pagination for large datasets
- Caching of frequently accessed data
- Lazy loading for non-critical content
- Database indexing for frequently queried columns

### 7. Responsive Design
- Mobile-friendly layout
- Collapsible sidebar
- Adaptive grid system
- Touch-friendly elements
- Optimized tables for small screens

### 8. Additional Admin Features
- System logs and audit trail
- Backup and restore functionality
- Email template management
- Payment gateway configuration
- SEO settings
- Maintenance mode