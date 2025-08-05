<?php
require_once '../../includes/functions.php';
require_once '../../includes/upload.php';

$conn = getDBConnection();

// Check if user is authenticated and has admin/owner permissions
$currentUser = getCurrentUser($conn);
if (!$currentUser || !hasPermission($currentUser, 'hostel_owner')) {
    header('Location: ../../login.php');
    exit();
}

// Get user's hostels (if hostel owner) or all hostels (if admin)
if ($currentUser['role'] === 'admin') {
    $hostelsQuery = "SELECT id, name, location FROM hostels ORDER BY name";
} else {
    $hostelsQuery = "SELECT id, name, location FROM hostels WHERE owner_id = '{$currentUser['id']}' ORDER BY name";
}
$hostelsResult = executeQuery($conn, $hostelsQuery);

// Handle image upload
$uploadMessage = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['upload_image'])) {
    $hostelId = sanitizeInput($conn, $_POST['hostel_id']);
    $roomId = isset($_POST['room_id']) ? sanitizeInput($conn, $_POST['room_id']) : '';
    $imageType = sanitizeInput($conn, $_POST['image_type']);
    
    if ($imageType === 'hostel') {
        // Upload hostel image
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadedPath = uploadImage($_FILES['image'], 'hostels');
            if ($uploadedPath) {
                $imagePath = sanitizeInput($conn, $uploadedPath);
                $isMain = isset($_POST['is_main']) ? 1 : 0;
                $caption = sanitizeInput($conn, $_POST['caption']);
                
                if ($isMain) {
                    $updateQuery = "UPDATE hostel_images SET is_main = 0 WHERE hostel_id = '$hostelId'";
                    executeQuery($conn, $updateQuery);
                }
                
                $insertQuery = "INSERT INTO hostel_images (hostel_id, image_path, caption, is_main, uploaded_by, created_at) 
                               VALUES ('$hostelId', '$imagePath', '$caption', $isMain, '{$currentUser['id']}', NOW())";
                executeQuery($conn, $insertQuery);
                $uploadMessage = 'Hostel image uploaded successfully!';
            } else {
                $uploadMessage = 'Failed to upload image. Please check file size and format.';
            }
        }
    } else {
        // Upload room image
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadedPath = uploadImage($_FILES['image'], 'rooms');
            if ($uploadedPath) {
                $imagePath = sanitizeInput($conn, $uploadedPath);
                $isMain = isset($_POST['is_main']) ? 1 : 0;
                $caption = sanitizeInput($conn, $_POST['caption']);
                
                if ($isMain) {
                    $updateQuery = "UPDATE room_images SET is_main = 0 WHERE room_id = '$roomId'";
                    executeQuery($conn, $updateQuery);
                }
                
                $insertQuery = "INSERT INTO room_images (room_id, image_path, caption, is_main, uploaded_by, created_at) 
                               VALUES ('$roomId', '$imagePath', '$caption', $isMain, '{$currentUser['id']}', NOW())";
                executeQuery($conn, $insertQuery);
                $uploadMessage = 'Room image uploaded successfully!';
            } else {
                $uploadMessage = 'Failed to upload image. Please check file size and format.';
            }
        }
    }
}

closeDBConnection($conn);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Management - <?php echo APP_NAME; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        function loadRooms(hostelId) {
            if (!hostelId) {
                document.getElementById('room_select').innerHTML = '<option value="">Select a hostel first</option>';
                return;
            }
            
            fetch(`../../api/rooms/get_rooms.php?hostel_id=${hostelId}`)
                .then(response => response.json())
                .then(data => {
                    const roomSelect = document.getElementById('room_select');
                    roomSelect.innerHTML = '<option value="">Select a room</option>';
                    
                    if (data.success && data.data) {
                        data.data.forEach(room => {
                            roomSelect.innerHTML += `<option value="${room.id}">${room.room_number} - ${room.type}</option>`;
                        });
                    }
                })
                .catch(error => {
                    console.error('Error loading rooms:', error);
                });
        }
        
        function toggleImageType() {
            const imageType = document.getElementById('image_type').value;
            const roomSection = document.getElementById('room_section');
            const hostelSection = document.getElementById('hostel_section');
            
            if (imageType === 'room') {
                roomSection.style.display = 'block';
                hostelSection.style.display = 'none';
            } else {
                roomSection.style.display = 'none';
                hostelSection.style.display = 'block';
            }
        }
    </script>
</head>
<body class="bg-gray-100">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <h1 class="text-xl font-semibold text-gray-900">Image Management</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="../admin/" class="text-gray-500 hover:text-gray-700">Dashboard</a>
                        <a href="../../logout.php" class="text-red-600 hover:text-red-800">Logout</a>
                    </div>
                </div>
            </div>
        </header>

        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <!-- Upload Form -->
            <div class="bg-white overflow-hidden shadow rounded-lg mb-6">
                <div class="px-4 py-5 sm:p-6">
                    <h2 class="text-lg font-medium text-gray-900 mb-4">Upload Images</h2>
                    
                    <?php if ($uploadMessage): ?>
                        <div class="mb-4 p-4 rounded-md <?php echo strpos($uploadMessage, 'successfully') !== false ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'; ?>">
                            <?php echo htmlspecialchars($uploadMessage); ?>
                        </div>
                    <?php endif; ?>

                    <form method="POST" enctype="multipart/form-data" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Image Type</label>
                            <select id="image_type" name="image_type" onchange="toggleImageType()" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                <option value="hostel">Hostel Image</option>
                                <option value="room">Room Image</option>
                            </select>
                        </div>

                        <div id="hostel_section">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Select Hostel</label>
                                <select name="hostel_id" onchange="loadRooms(this.value)" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                    <option value="">Choose a hostel</option>
                                    <?php while ($hostel = mysqli_fetch_assoc($hostelsResult)): ?>
                                        <option value="<?php echo $hostel['id']; ?>"><?php echo htmlspecialchars($hostel['name']); ?> - <?php echo htmlspecialchars($hostel['location']); ?></option>
                                    <?php endwhile; ?>
                                </select>
                            </div>
                        </div>

                        <div id="room_section" style="display: none;">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Select Room</label>
                                <select id="room_select" name="room_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                    <option value="">Select a hostel first</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Image File</label>
                            <input type="file" name="image" accept="image/*" required class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                            <p class="mt-1 text-sm text-gray-500">Maximum file size: 5MB. Supported formats: JPG, PNG, GIF</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Caption (Optional)</label>
                            <input type="text" name="caption" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        </div>

                        <div class="flex items-center">
                            <input type="checkbox" name="is_main" id="is_main" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                            <label for="is_main" class="ml-2 block text-sm text-gray-900">Set as main image</label>
                        </div>

                        <div>
                            <button type="submit" name="upload_image" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Upload Image
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Image Gallery -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Uploads</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- This would be populated with actual uploaded images -->
                        <div class="border rounded-lg p-4">
                            <p class="text-sm text-gray-500">No images uploaded yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html> 