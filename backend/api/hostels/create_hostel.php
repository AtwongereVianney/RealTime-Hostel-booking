<?php
require_once '../../includes/functions.php';
require_once '../../includes/upload.php';

$conn = getDBConnection();

// Check if user is authenticated and is a hostel owner or admin
$user = getCurrentUser($conn);
if (!$user || !hasPermission($user, 'hostel_owner')) {
    sendError('Unauthorized', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

try {
    // Validate required fields
    $requiredFields = ['name', 'description', 'location', 'price'];
    foreach ($requiredFields as $field) {
        if (!isset($_POST[$field]) || empty($_POST[$field])) {
            sendError("Missing required field: $field");
        }
    }
    
    // Sanitize inputs
    $name = sanitizeInput($conn, $_POST['name']);
    $description = sanitizeInput($conn, $_POST['description']);
    $location = sanitizeInput($conn, $_POST['location']);
    $price = (float)$_POST['price'];
    $phone = isset($_POST['phone']) ? sanitizeInput($conn, $_POST['phone']) : '';
    $email = isset($_POST['email']) ? sanitizeInput($conn, $_POST['email']) : '';
    $whatsapp = isset($_POST['whatsapp']) ? sanitizeInput($conn, $_POST['whatsapp']) : '';
    $lat = isset($_POST['lat']) ? (float)$_POST['lat'] : null;
    $lng = isset($_POST['lng']) ? (float)$_POST['lng'] : null;
    
    // Validate email if provided
    if ($email && !validateEmail($email)) {
        sendError('Invalid email format');
    }
    
    // Insert hostel
    $query = "INSERT INTO hostels (name, description, location, price, phone, email, whatsapp, lat, lng, owner_id) 
              VALUES ('$name', '$description', '$location', $price, '$phone', '$email', '$whatsapp', $lat, $lng, {$user['id']})";
    
    executeQuery($conn, $query);
    $hostelId = mysqli_insert_id($conn);
    
    // Handle amenities
    if (isset($_POST['amenities']) && is_array($_POST['amenities'])) {
        foreach ($_POST['amenities'] as $amenity) {
            $amenity = sanitizeInput($conn, $amenity);
            $amenityQuery = "INSERT INTO hostel_amenities (hostel_id, amenity) VALUES ($hostelId, '$amenity')";
            executeQuery($conn, $amenityQuery);
        }
    }
    
    // Handle image uploads
    if (isset($_FILES['images'])) {
        $uploadedImages = [];
        
        foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
            $file = [
                'tmp_name' => $tmpName,
                'name' => $_FILES['images']['name'][$key],
                'size' => $_FILES['images']['size'][$key]
            ];
            
            $imagePath = uploadImage($file, 'hostels');
            if ($imagePath) {
                $isMain = ($key === 0) ? 1 : 0; // First image is main
                $imageQuery = "INSERT INTO hostel_images (hostel_id, image_path, is_main) VALUES ($hostelId, '$imagePath', $isMain)";
                executeQuery($conn, $imageQuery);
                $uploadedImages[] = $imagePath;
            }
        }
    }
    
    sendSuccess(['hostelId' => $hostelId], 'Hostel created successfully');
    
} catch (Exception $e) {
    sendError('Failed to create hostel: ' . $e->getMessage(), 500);
} finally {
    closeDBConnection($conn);
}
?>