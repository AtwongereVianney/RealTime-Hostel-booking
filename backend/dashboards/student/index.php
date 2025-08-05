<?php
require_once '../../includes/auth_middleware.php';

// Require student role
requireRole('student');
checkSessionTimeout();

$currentUser = getCurrentUserData();
$conn = getDBConnection();

// Get student's bookings
$bookingsQuery = "SELECT b.*, r.room_number, r.type, h.name as hostel_name, h.location 
                  FROM bookings b 
                  JOIN rooms r ON b.room_id = r.id 
                  JOIN hostels h ON r.hostel_id = h.id 
                  WHERE b.user_id = '{$currentUser['id']}' 
                  ORDER BY b.created_at DESC LIMIT 10";
$bookingsResult = executeQuery($conn, $bookingsQuery);

// Get recent notifications
$notificationsQuery = "SELECT * FROM notifications 
                       WHERE user_id = '{$currentUser['id']}' 
                       ORDER BY created_at DESC LIMIT 5";
$notificationsResult = executeQuery($conn, $notificationsQuery);

// Get booking statistics
$statsQuery = "SELECT 
                COUNT(*) as total_bookings,
                SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bookings
                FROM bookings WHERE user_id = '{$currentUser['id']}'";
$statsResult = executeQuery($conn, $statsQuery);
$stats = mysqli_fetch_assoc($statsResult);

closeDBConnection($conn);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - <?php echo APP_NAME; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <h1 class="text-xl font-semibold text-gray-900">Student Dashboard</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-gray-700">Welcome, <?php echo htmlspecialchars($currentUser['name']); ?></span>
                        <a href="#" class="text-indigo-600 hover:text-indigo-800">Browse Hostels</a>
                        <a href="../../auth/logout.php" class="text-red-600 hover:text-red-800">Logout</a>
                    </div>
                </div>
            </div>
        </header>

        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <i class="fas fa-calendar-check text-3xl text-blue-600"></i>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                                    <dd class="text-lg font-medium text-gray-900"><?php echo $stats['total_bookings']; ?></dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <i class="fas fa-check-circle text-3xl text-green-600"></i>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Confirmed</dt>
                                    <dd class="text-lg font-medium text-gray-900"><?php echo $stats['confirmed_bookings']; ?></dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <i class="fas fa-clock text-3xl text-yellow-600"></i>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                    <dd class="text-lg font-medium text-gray-900"><?php echo $stats['pending_bookings']; ?></dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Recent Bookings -->
                <div class="bg-white shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">My Bookings</h3>
                        <?php if (mysqli_num_rows($bookingsResult) > 0): ?>
                            <div class="space-y-4">
                                <?php while ($booking = mysqli_fetch_assoc($bookingsResult)): ?>
                                <div class="border rounded-lg p-4">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h4 class="font-medium text-gray-900"><?php echo htmlspecialchars($booking['hostel_name']); ?></h4>
                                            <p class="text-sm text-gray-600">Room <?php echo htmlspecialchars($booking['room_number']); ?> (<?php echo ucfirst($booking['type']); ?>)</p>
                                            <p class="text-sm text-gray-500"><?php echo htmlspecialchars($booking['location']); ?></p>
                                            <p class="text-sm text-gray-500">
                                                <?php echo date('M j, Y', strtotime($booking['check_in_date'])); ?> - 
                                                <?php echo date('M j, Y', strtotime($booking['check_out_date'])); ?>
                                            </p>
                                        </div>
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full 
                                                   <?php echo $booking['status'] === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                                          ($booking['status'] === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'); ?>">
                                            <?php echo ucfirst($booking['status']); ?>
                                        </span>
                                    </div>
                                </div>
                                <?php endwhile; ?>
                            </div>
                        <?php else: ?>
                            <div class="text-center py-8">
                                <i class="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
                                <p class="text-gray-500">No bookings yet</p>
                                <a href="#" class="mt-2 inline-block text-indigo-600 hover:text-indigo-800">Browse available rooms</a>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Notifications -->
                <div class="bg-white shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Notifications</h3>
                        <?php if (mysqli_num_rows($notificationsResult) > 0): ?>
                            <div class="space-y-3">
                                <?php while ($notification = mysqli_fetch_assoc($notificationsResult)): ?>
                                <div class="flex items-start space-x-3 p-3 <?php echo $notification['is_read'] ? 'bg-gray-50' : 'bg-blue-50'; ?> rounded-lg">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-bell text-sm <?php echo $notification['is_read'] ? 'text-gray-400' : 'text-blue-600'; ?>"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900"><?php echo htmlspecialchars($notification['title']); ?></p>
                                        <p class="text-sm text-gray-600"><?php echo htmlspecialchars($notification['message']); ?></p>
                                        <p class="text-xs text-gray-500 mt-1"><?php echo date('M j, Y g:i A', strtotime($notification['created_at'])); ?></p>
                                    </div>
                                </div>
                                <?php endwhile; ?>
                            </div>
                        <?php else: ?>
                            <div class="text-center py-8">
                                <i class="fas fa-bell-slash text-4xl text-gray-400 mb-4"></i>
                                <p class="text-gray-500">No notifications</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="mt-8 bg-white shadow rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="#" class="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="fas fa-search text-2xl text-indigo-600 mr-4"></i>
                        <div>
                            <h4 class="font-medium text-gray-900">Find Rooms</h4>
                            <p class="text-sm text-gray-600">Browse available rooms</p>
                        </div>
                    </a>
                    <a href="#" class="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="fas fa-history text-2xl text-green-600 mr-4"></i>
                        <div>
                            <h4 class="font-medium text-gray-900">Booking History</h4>
                            <p class="text-sm text-gray-600">View all your bookings</p>
                        </div>
                    </a>
                    <a href="#" class="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="fas fa-cog text-2xl text-gray-600 mr-4"></i>
                        <div>
                            <h4 class="font-medium text-gray-900">Settings</h4>
                            <p class="text-sm text-gray-600">Manage your account</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
