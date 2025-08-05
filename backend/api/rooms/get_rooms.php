<?php
require_once '../../includes/functions.php';

$conn = getDBConnection();

// Check if user is authenticated
$currentUser = getCurrentUser($conn);
if (!$currentUser) {
    sendError('Unauthorized access', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

// Get hostel ID from query parameters
$hostelId = isset($_GET['hostel_id']) ? sanitizeInput($conn, $_GET['hostel_id']) : '';
if (empty($hostelId)) {
    sendError('Hostel ID is required');
}

// Verify user has access to this hostel (owner or admin)
$hostelQuery = "SELECT id, owner_id FROM hostels WHERE id = '$hostelId'";
$hostelResult = executeQuery($conn, $hostelQuery);
if (mysqli_num_rows($hostelResult) == 0) {
    sendError('Hostel not found', 404);
}

$hostel = mysqli_fetch_assoc($hostelResult);
if ($currentUser['role'] !== 'admin' && $hostel['owner_id'] !== $currentUser['id']) {
    sendError('Access denied', 403);
}

// Get rooms for this hostel
$roomsQuery = "SELECT id, room_number, type, capacity, price, status 
               FROM rooms 
               WHERE hostel_id = '$hostelId' 
               ORDER BY room_number";
$roomsResult = executeQuery($conn, $roomsQuery);

$rooms = [];
while ($room = mysqli_fetch_assoc($roomsResult)) {
    $rooms[] = $room;
}

closeDBConnection($conn);

sendSuccess($rooms, 'Rooms retrieved successfully');
?> 