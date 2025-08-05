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

// Get hostel ID from request
$hostelId = isset($_POST['hostel_id']) ? sanitizeInput($conn, $_POST['hostel_id']) : '';
if (empty($hostelId)) {
    sendError('Hostel ID is required');
}

// Verify hostel exists and user owns it (unless admin)
$query = "SELECT id, name, owner_id FROM hostels WHERE id = '$hostelId'";
$result = executeQuery($conn, $query);
if (mysqli_num_rows($result) == 0) {
    sendError('Hostel not found', 404);
}

$hostel = mysqli_fetch_assoc($result);
if ($currentUser['role'] !== 'admin' && $hostel['owner_id'] !== $currentUser['id']) {
    sendError('You can only upload images to your own hostels', 403);
}

// Check if image file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    sendError('Please select a valid image file');
}

$imageFile = $_FILES['image'];

// Upload the image
$uploadedPath = uploadImage($imageFile, 'hostels');
if (!$uploadedPath) {
    sendError('Failed to upload image. Please check file size and format.');
}

// Save image record to database
$imagePath = sanitizeInput($conn, $uploadedPath);
$isMain = isset($_POST['is_main']) && $_POST['is_main'] == '1' ? 1 : 0;
$caption = isset($_POST['caption']) ? sanitizeInput($conn, $_POST['caption']) : '';

// If this is marked as main image, unset other main images for this hostel
if ($isMain) {
    $updateQuery = "UPDATE hostel_images SET is_main = 0 WHERE hostel_id = '$hostelId'";
    executeQuery($conn, $updateQuery);
}

// Insert new image record
$insertQuery = "INSERT INTO hostel_images (hostel_id, image_path, caption, is_main, uploaded_by, created_at) 
                VALUES ('$hostelId', '$imagePath', '$caption', $isMain, '{$currentUser['id']}', NOW())";
executeQuery($conn, $insertQuery);

$imageId = mysqli_insert_id($conn);

// Get the inserted image data
$imageQuery = "SELECT id, image_path, caption, is_main, created_at FROM hostel_images WHERE id = $imageId";
$imageResult = executeQuery($conn, $imageQuery);
$imageData = mysqli_fetch_assoc($imageResult);

closeDBConnection($conn);

sendSuccess($imageData, 'Hostel image uploaded successfully');
?> 