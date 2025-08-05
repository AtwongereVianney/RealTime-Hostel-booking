<?php
require_once '../../includes/auth_middleware.php';

// Require admin or hostel owner role
requireRole('admin');
checkSessionTimeout();

$currentUser = getCurrentUserData();
$conn = getDBConnection();

// Get dashboard statistics
$stats = [];

// Total hostels (admin sees all, owner sees their own)
if ($currentUser['role'] === 'admin') {
    $hostelsQuery = "SELECT COUNT(*) as total FROM hostels WHERE status = 'active'";
} else {
    $hostelsQuery = "SELECT COUNT(*) as total FROM hostels WHERE owner_id = '{$currentUser['id']}' AND status = 'active'";
}
$hostelsResult = executeQuery($conn, $hostelsQuery);
$stats['total_hostels'] = mysqli_fetch_assoc($hostelsResult)['total'];

// Total rooms
if ($currentUser['role'] === 'admin') {
    $roomsQuery = "SELECT COUNT(*) as total FROM rooms";
} else {
    $roomsQuery = "SELECT COUNT(*) as total FROM rooms r 
                   JOIN hostels h ON r.hostel_id = h.id 
                   WHERE h.owner_id = '{$currentUser['id']}'";
}
$roomsResult = executeQuery($conn, $roomsQuery);
$stats['total_rooms'] = mysqli_fetch_assoc($roomsResult)['total'];

// Available rooms
if ($currentUser['role'] === 'admin') {
    $availableQuery = "SELECT COUNT(*) as total FROM rooms WHERE status = 'available'";
} else {
    $availableQuery = "SELECT COUNT(*) as total FROM rooms r 
                       JOIN hostels h ON r.hostel_id = h.id 
                       WHERE h.owner_id = '{$currentUser['id']}' AND r.status = 'available'";
}
$availableResult = executeQuery($conn, $availableQuery);
$stats['available_rooms'] = mysqli_fetch_assoc($availableResult)['total'];

// Recent bookings
if ($currentUser['role'] === 'admin') {
    $bookingsQuery = "SELECT b.*, r.room_number, h.name as hostel_name, u.name as user_name 
                      FROM bookings b 
                      JOIN rooms r ON b.room_id = r.id 
                      JOIN hostels h ON r.hostel_id = h.id 
                      JOIN users u ON b.user_id = u.id 
                      ORDER BY b.created_at DESC LIMIT 5";
} else {
    $bookingsQuery = "SELECT b.*, r.room_number, h.name as hostel_name, u.name as user_name 
                      FROM bookings b 
                      JOIN rooms r ON b.room_id = r.id 
                      JOIN hostels h ON r.hostel_id = h.id 
                      JOIN users u ON b.user_id = u.id 
                      WHERE h.owner_id = '{$currentUser['id']}' 
                      ORDER BY b.created_at DESC LIMIT 5";
}
$bookingsResult = executeQuery($conn, $bookingsQuery);

closeDBConnection($conn);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - <?php echo APP_NAME; ?></title>
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
                        <h1 class="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-gray-700">Welcome, <?php echo htmlspecialchars($currentUser['name']); ?></span>
                        <a href="image_management.php" class="text-indigo-600 hover:text-indigo-800">Image Management</a>
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
                                <i class="fas fa-building text-3xl text-indigo-600"></i>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Total Hostels</dt>
                                    <dd class="text-lg font-medium text-gray-900"><?php echo $stats['total_hostels']; ?></dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <i class="fas fa-door-open text-3xl text-green-600"></i>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Total Rooms</dt>
                                    <dd class="text-lg font-medium text-gray-900"><?php echo $stats['total_rooms']; ?></dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <i class="fas fa-check-circle text-3xl text-blue-600"></i>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Available Rooms</dt>
                                    <dd class="text-lg font-medium text-gray-900"><?php echo $stats['available_rooms']; ?></dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Bookings -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Bookings</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <?php while ($booking = mysqli_fetch_assoc($bookingsResult)): ?>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <?php echo htmlspecialchars($booking['user_name']); ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <?php echo htmlspecialchars($booking['hostel_name']); ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <?php echo htmlspecialchars($booking['room_number']); ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                   <?php echo $booking['status'] === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                                          ($booking['status'] === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'); ?>">
                                            <?php echo ucfirst($booking['status']); ?>
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <?php echo date('M j, Y', strtotime($booking['created_at'])); ?>
                                    </td>
                                </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white shadow rounded-lg p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div class="space-y-3">
                        <a href="image_management.php" class="block w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                            <i class="fas fa-images mr-2"></i> Manage Images
                        </a>
                        <a href="#" class="block w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                            <i class="fas fa-plus mr-2"></i> Add New Hostel
                        </a>
                        <a href="#" class="block w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                            <i class="fas fa-users mr-2"></i> Manage Users
                        </a>
                    </div>
                </div>

                <div class="bg-white shadow rounded-lg p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">System Status</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">Database Connection</span>
                            <span class="text-green-600"><i class="fas fa-check-circle"></i></span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">File Uploads</span>
                            <span class="text-green-600"><i class="fas fa-check-circle"></i></span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">Email Service</span>
                            <span class="text-yellow-600"><i class="fas fa-exclamation-triangle"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html> 