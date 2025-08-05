<?php
require_once '../../includes/functions.php';
require_once '../../includes/upload.php';

$conn = getDBConnection();

// Check if user is authenticated and has admin/owner permissions
$currentUser = getCurrentUser($conn);
if (!$currentUser || !hasPermission($currentUser, 'hostel_owner')) {
    sendError('Unauthorized access', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Get room ID from request
$roomId = isset($_POST['room_id']) ? sanitizeInput($conn, $_POST['room_id']) : '';
if (empty($roomId)) {
    sendError('Room ID is required');
}

// Verify room exists and user owns the hostel (unless admin)
$query = "SELECT r.id, r.room_number, r.hostel_id, h.name as hostel_name, h.owner_id 
          FROM rooms r 
          JOIN hostels h ON r.hostel_id = h.id 
          WHERE r.id = '$roomId'";
$result = executeQuery($conn, $query);
if (mysqli_num_rows($result) == 0) {
    sendError('Room not found', 404);
}

$room = mysqli_fetch_assoc($result);
if ($currentUser['role'] !== 'admin' && $room['owner_id'] !== $currentUser['id']) {
    sendError('You can only upload images to rooms in your own hostels', 403);
}

// Check if image file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    sendError('Please select a valid image file');
}

$imageFile = $_FILES['image'];

// Upload the image
$uploadedPath = uploadImage($imageFile, 'rooms');
if (!$uploadedPath) {
    sendError('Failed to upload image. Please check file size and format.');
}

// Save image record to database
$imagePath = sanitizeInput($conn, $uploadedPath);
$isMain = isset($_POST['is_main']) && $_POST['is_main'] == '1' ? 1 : 0;
$caption = isset($_POST['caption']) ? sanitizeInput($conn, $_POST['caption']) : '';

// If this is marked as main image, unset other main images for this room
if ($isMain) {
    $updateQuery = "UPDATE room_images SET is_main = 0 WHERE room_id = '$roomId'";
    executeQuery($conn, $updateQuery);
}

// Insert new image record
$insertQuery = "INSERT INTO room_images (room_id, image_path, caption, is_main, uploaded_by, created_at) 
                VALUES ('$roomId', '$imagePath', '$caption', $isMain, '{$currentUser['id']}', NOW())";
executeQuery($conn, $insertQuery);

$imageId = mysqli_insert_id($conn);

// Get the inserted image data
$imageQuery = "SELECT id, image_path, caption, is_main, created_at FROM room_images WHERE id = $imageId";
$imageResult = executeQuery($conn, $imageQuery);
$imageData = mysqli_fetch_assoc($imageResult);

closeDBConnection($conn);

sendSuccess($imageData, 'Room image uploaded successfully');
?> 