<?php
session_start();
require_once '../../includes/functions.php';

$conn = getDBConnection();

// Check if user is logged in and is a student
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    header('Location: ../../login.php');
    exit();
}

$userId = $_SESSION['user_id'];
$user = getCurrentUser($conn);

// Get user's bookings
$bookingsQuery = "SELECT b.*, h.name as hostel_name, r.room_number, r.type as room_type
                  FROM bookings b
                  JOIN hostels h ON b.hostel_id = h.id
                  JOIN rooms r ON b.room_id = r.id
                  WHERE b.user_id = $userId
                  ORDER BY b.created_at DESC";
$bookingsResult = executeQuery($conn, $bookingsQuery);

// Get user's notifications
$notificationsQuery = "SELECT * FROM notifications 
                       WHERE user_id = $userId 
                       ORDER BY created_at DESC 
                       LIMIT 10";
$notificationsResult = executeQuery($conn, $notificationsQuery);

closeDBConnection($conn);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - <?php echo APP_NAME; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <h1 class="text-xl font-semibold">Student Dashboard</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span>Welcome, <?php echo htmlspecialchars($user['name']); ?></span>
                        <a href="../../logout.php" class="text-red-600">Logout</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Profile Card -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900">Profile</h3>
                        <div class="mt-4">
                            <p><strong>Name:</strong> <?php echo htmlspecialchars($user['name']); ?></p>
                            <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
                            <p><strong>Phone:</strong> <?php echo htmlspecialchars($user['phone']); ?></p>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900">Quick Stats</h3>
                        <div class="mt-4 space-y-2">
                            <p><strong>Total Bookings:</strong> <?php echo mysqli_num_rows($bookingsResult); ?></p>
                            <p><strong>Active Bookings:</strong> 
                                <?php 
                                $activeBookings = 0;
                                mysqli_data_seek($bookingsResult, 0);
                                while ($booking = mysqli_fetch_assoc($bookingsResult)) {
                                    if ($booking['status'] === 'confirmed') $activeBookings++;
                                }
                                echo $activeBookings;
                                ?>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Recent Notifications -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900">Recent Notifications</h3>
                        <div class="mt-4 space-y-2">
                            <?php while ($notification = mysqli_fetch_assoc($notificationsResult)): ?>
                                <div class="text-sm">
                                    <p class="font-medium"><?php echo htmlspecialchars($notification['title']); ?></p>
                                    <p class="text-gray-600"><?php echo htmlspecialchars($notification['message']); ?></p>
                                </div>
                            <?php endwhile; ?>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bookings Section -->
            <div class="mt-8">
                <div class="bg-white shadow rounded-lg">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-medium text-gray-900">My Bookings</h3>
                    </div>
                    <div class="p-6">
                        <?php if (mysqli_num_rows($bookingsResult) > 0): ?>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <?php mysqli_data_seek($bookingsResult, 0); ?>
                                        <?php while ($booking = mysqli_fetch_assoc($bookingsResult)): ?>
                                            <tr>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <?php echo htmlspecialchars($booking['hostel_name']); ?>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <?php echo htmlspecialchars($booking['room_number']); ?> (<?php echo ucfirst($booking['room_type']); ?>)
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <?php echo date('M d, Y', strtotime($booking['check_in_date'])); ?>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    UGX <?php echo number_format($booking['total_amount']); ?>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        <?php 
                                                        switch($booking['status']) {
                                                            case 'confirmed': echo 'bg-green-100 text-green-800'; break;
                                                            case 'pending': echo 'bg-yellow-100 text-yellow-800'; break;
                                                            case 'rejected': echo 'bg-red-100 text-red-800'; break;
                                                            default: echo 'bg-gray-100 text-gray-800';
                                                        }
                                                        ?>">
                                                        <?php echo ucfirst($booking['status']); ?>
                                                    </span>
                                                </td>
                                            </tr>
                                        <?php endwhile; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php else: ?>
                            <p class="text-gray-500 text-center py-4">No bookings found.</p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
<
