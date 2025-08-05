<?php
require_once '../../includes/functions.php';

$conn = getDBConnection();

try {
    $query = "SELECT h.*, 
                     u.name as owner_name,
                     COUNT(DISTINCT r.id) as total_rooms,
                     COUNT(DISTINCT CASE WHEN r.status = 'available' THEN r.id END) as available_rooms,
                     GROUP_CONCAT(DISTINCT ha.amenity) as amenities
              FROM hostels h
              LEFT JOIN users u ON h.owner_id = u.id
              LEFT JOIN rooms r ON h.id = r.hostel_id
              LEFT JOIN hostel_amenities ha ON h.id = ha.hostel_id
              GROUP BY h.id
              ORDER BY h.created_at DESC";
    
    $result = executeQuery($conn, $query);
    $hostels = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        // Get main image
        $imageQuery = "SELECT image_path FROM hostel_images WHERE hostel_id = {$row['id']} AND is_main = 1 LIMIT 1";
        $imageResult = executeQuery($conn, $imageQuery);
        $mainImage = mysqli_fetch_assoc($imageResult);
        
        $hostels[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'location' => $row['location'],
            'price' => (float)$row['price'],
            'rating' => (float)$row['rating'],
            'reviews' => (int)$row['reviews'],
            'mainImage' => $mainImage ? $mainImage['image_path'] : null,
            'amenities' => $row['amenities'] ? explode(',', $row['amenities']) : [],
            'totalRooms' => (int)$row['total_rooms'],
            'availableRooms' => (int)$row['available_rooms'],
            'owner' => [
                'id' => $row['owner_id'],
                'name' => $row['owner_name']
            ],
            'contact' => [
                'phone' => $row['phone'],
                'email' => $row['email'],
                'whatsapp' => $row['whatsapp']
            ],
            'coordinates' => [
                'lat' => (float)$row['lat'],
                'lng' => (float)$row['lng']
            ],
            'createdAt' => $row['created_at']
        ];
    }
    
    sendSuccess($hostels);
    
} catch (Exception $e) {
    sendError('Failed to fetch hostels: ' . $e->getMessage(), 500);
} finally {
    closeDBConnection($conn);
}
?>