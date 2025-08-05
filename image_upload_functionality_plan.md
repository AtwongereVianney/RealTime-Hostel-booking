# Image Upload Functionality Plan

## Overview
Implement image upload functionality for hostels and rooms using HTML, JavaScript, and Bootstrap with server-side processing in PHP.

## Key Features
1. Upload images for hostels
2. Upload images for rooms
3. Set main images
4. Add captions to images
5. View and manage uploaded images
6. Delete images

## Implementation Structure
- `frontend/images/hostel_upload.php` - Upload hostel images
- `frontend/images/room_upload.php` - Upload room images
- `frontend/images/manage.php` - Manage all images
- `frontend/images/view.php` - View image details

## Implementation Details

### 1. Image Upload Form (`images/hostel_upload.php`)

#### A. HTML Structure
```html
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h2>Upload Hostel Images</h2>
                </div>
                <div class="card-body">
                    <?php if ($message): ?>
                        <div class="alert alert-<?php echo strpos($message, 'successfully') !== false ? 'success' : 'danger'; ?>">
                            <?php echo htmlspecialchars($message); ?>
                        </div>
                    <?php endif; ?>
                    
                    <form method="POST" enctype="multipart/form-data" id="uploadForm">
                        <div class="mb-3">
                            <label for="hostel_id" class="form-label">Select Hostel</label>
                            <select class="form-select" name="hostel_id" id="hostel_id" required>
                                <option value="">Choose a hostel</option>
                                <?php foreach ($hostels as $hostel): ?>
                                    <option value="<?php echo $hostel['id']; ?>" <?php echo ($_POST['hostel_id'] ?? '') === $hostel['id'] ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($hostel['name']); ?> - <?php echo htmlspecialchars($hostel['location']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="images" class="form-label">Select Images</label>
                            <input class="form-control" type="file" name="images[]" id="images" accept="image/*" multiple required>
                            <div class="form-text">You can select multiple images. Maximum file size: 5MB each.</div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="caption" class="form-label">Caption (Optional)</label>
                            <input type="text" class="form-control" name="caption" id="caption" value="<?php echo htmlspecialchars($_POST['caption'] ?? ''); ?>">
                        </div>
                        
                        <div class="mb-3 form-check">
                            <input class="form-check-input" type="checkbox" name="is_main" id="is_main" <?php echo ($_POST['is_main'] ?? '') ? 'checked' : ''; ?>>
                            <label class="form-check-label" for="is_main">
                                Set as main image
                            </label>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-primary btn-lg" name="upload_images">
                                <i class="fas fa-upload"></i> Upload Images
                            </button>
                            <a href="manage.php" class="btn btn-secondary">Manage Images</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
```

### 2. Image Management Page (`images/manage.php`)

#### A. Features
1. Grid view of all images
2. Filter by hostel/room
3. Set main images
4. Delete images
5. View image details

#### B. HTML Structure
```html
<div class="container-fluid">
    <div class="row">
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Image Management</h1>
                <div class="btn-toolbar mb-2 mb-md-0">
                    <div class="btn-group me-2">
                        <a href="hostel_upload.php" class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-hotel"></i> Upload Hostel Images
                        </a>
                        <a href="room_upload.php" class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-door-open"></i> Upload Room Images
                        </a>
                    </div>
                </div>
            </div>

            <!-- Filter Section -->
            <div class="card mb-4">
                <div class="card-body">
                    <form method="GET" class="row g-3">
                        <div class="col-md-4">
                            <label for="hostel_filter" class="form-label">Hostel</label>
                            <select class="form-select" id="hostel_filter" name="hostel_id">
                                <option value="">All Hostels</option>
                                <?php foreach ($hostels as $hostel): ?>
                                    <option value="<?php echo $hostel['id']; ?>" <?php echo ($_GET['hostel_id'] ?? '') === $hostel['id'] ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($hostel['name']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label for="image_type" class="form-label">Image Type</label>
                            <select class="form-select" id="image_type" name="type">
                                <option value="">All Types</option>
                                <option value="hostel" <?php echo ($_GET['type'] ?? '') === 'hostel' ? 'selected' : ''; ?>>Hostel Images</option>
                                <option value="room" <?php echo ($_GET['type'] ?? '') === 'room' ? 'selected' : ''; ?>>Room Images</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">&nbsp;</label>
                            <div>
                                <button type="submit" class="btn btn-primary">Filter</button>
                                <a href="manage.php" class="btn btn-secondary">Reset</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Images Grid -->
            <?php if (count($images) > 0): ?>
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    <?php foreach ($images as $image): ?>
                        <div class="col">
                            <div class="card h-100">
                                <img src="<?php echo htmlspecialchars($image['image_path']); ?>" class="card-img-top" alt="<?php echo htmlspecialchars($image['caption'] ?? 'Image'); ?>" style="height: 200px; object-fit: cover;">
                                <div class="card-body">
                                    <h5 class="card-title"><?php echo htmlspecialchars($image['caption'] ?? 'No caption'); ?></h5>
                                    <p class="card-text">
                                        <small class="text-muted">
                                            <?php echo $image['type'] === 'hostel' ? 'Hostel: ' . htmlspecialchars($image['hostel_name']) : 'Room: ' . htmlspecialchars($image['room_number']); ?>
                                        </small>
                                    </p>
                                    <p class="card-text">
                                        <small class="text-muted">
                                            Uploaded: <?php echo date('M j, Y', strtotime($image['created_at'])); ?>
                                        </small>
                                    </p>
                                    <?php if ($image['is_main']): ?>
                                        <span class="badge bg-primary">Main Image</span>
                                    <?php endif; ?>
                                </div>
                                <div class="card-footer">
                                    <div class="btn-group" role="group">
                                        <?php if (!$image['is_main']): ?>
                                            <a href="set_main.php?id=<?php echo $image['id']; ?>&type=<?php echo $image['type']; ?>" class="btn btn-sm btn-outline-primary" title="Set as Main">
                                                <i class="fas fa-star"></i>
                                            </a>
                                        <?php else: ?>
                                            <button class="btn btn-sm btn-primary" disabled>
                                                <i class="fas fa-star"></i> Main
                                            </button>
                                        <?php endif; ?>
                                        <a href="view.php?id=<?php echo $image['id']; ?>&type=<?php echo $image['type']; ?>" class="btn btn-sm btn-outline-secondary" title="View">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="delete.php?id=<?php echo $image['id']; ?>&type=<?php echo $image['type']; ?>" class="btn btn-sm btn-outline-danger" title="Delete" onclick="return confirm('Are you sure you want to delete this image?')">
                                            <i class="fas fa-trash"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                
                <!-- Pagination -->
                <?php if ($totalPages > 1): ?>
                    <nav aria-label="Image list pagination" class="mt-4">
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
                <div class="text-center py-5">
                    <i class="fas fa-image fa-3x text-muted mb-3"></i>
                    <h3>No images found</h3>
                    <p class="text-muted">Upload some images to get started.</p>
                    <div class="mt-3">
                        <a href="hostel_upload.php" class="btn btn-primary">Upload Hostel Images</a>
                        <a href="room_upload.php" class="btn btn-primary">Upload Room Images</a>
                    </div>
                </div>
            <?php endif; ?>
        </main>
    </div>
</div>
```

### 3. Database Operations

#### A. Image Upload
```php
// Process multiple image uploads
if (isset($_FILES['images']) && is_array($_FILES['images']['name'])) {
    $uploadedCount = 0;
    $errors = [];
    
    for ($i = 0; $i < count($_FILES['images']['name']); $i++) {
        // Check for upload errors
        if ($_FILES['images']['error'][$i] !== UPLOAD_ERR_OK) {
            $errors[] = "Error uploading file: " . $_FILES['images']['name'][$i];
            continue;
        }
        
        // Validate file
        $file = [
            'tmp_name' => $_FILES['images']['tmp_name'][$i],
            'name' => $_FILES['images']['name'][$i],
            'size' => $_FILES['images']['size'][$i],
            'type' => $_FILES['images']['type'][$i]
        ];
        
        if (!validateImage($file)) {
            $errors[] = "Invalid file: " . $_FILES['images']['name'][$i];
            continue;
        }
        
        // Upload image
        $uploadedPath = uploadImage($file, $uploadFolder);
        if (!$uploadedPath) {
            $errors[] = "Failed to upload: " . $_FILES['images']['name'][$i];
            continue;
        }
        
        // Save to database
        $imagePath = mysqli_real_escape_string($conn, $uploadedPath);
        $caption = mysqli_real_escape_string($conn, $_POST['caption'] ?? '');
        $isMain = isset($_POST['is_main']) ? 1 : 0;
        
        if ($imageType === 'hostel') {
            // Set other images as not main if this is main
            if ($isMain) {
                $updateQuery = "UPDATE hostel_images SET is_main = 0 WHERE hostel_id = '$hostelId'";
                executeQuery($conn, $updateQuery);
            }
            
            $insertQuery = "INSERT INTO hostel_images (hostel_id, image_path, caption, is_main, uploaded_by, created_at) 
                           VALUES ('$hostelId', '$imagePath', '$caption', $isMain, '$userId', NOW())";
        } else {
            // Room image
            $roomId = mysqli_real_escape_string($conn, $_POST['room_id']);
            
            // Set other images as not main if this is main
            if ($isMain) {
                $updateQuery = "UPDATE room_images SET is_main = 0 WHERE room_id = '$roomId'";
                executeQuery($conn, $updateQuery);
            }
            
            $insertQuery = "INSERT INTO room_images (room_id, image_path, caption, is_main, uploaded_by, created_at) 
                           VALUES ('$roomId', '$imagePath', '$caption', $isMain, '$userId', NOW())";
        }
        
        if (executeQuery($conn, $insertQuery)) {
            $uploadedCount++;
        } else {
            $errors[] = "Failed to save to database: " . $_FILES['images']['name'][$i];
        }
    }
    
    if ($uploadedCount > 0) {
        $message = "$uploadedCount image(s) uploaded successfully!";
    }
    
    if (count($errors) > 0) {
        $message .= " Errors: " . implode(', ', $errors);
    }
}
```

#### B. Image Management Queries
```php
// Get images with filtering
$imagesQuery = "SELECT 
                hi.id, 
                hi.image_path, 
                hi.caption, 
                hi.is_main, 
                hi.created_at,
                'hostel' as type,
                h.name as hostel_name,
                NULL as room_number
                FROM hostel_images hi
                JOIN hostels h ON hi.hostel_id = h.id
                WHERE 1=1";

// Add filters
if (!empty($hostelId)) {
    $imagesQuery .= " AND hi.hostel_id = '" . mysqli_real_escape_string($conn, $hostelId) . "'";
}

if (!empty($imageType) && $imageType === 'hostel') {
    // Already filtered for hostel images
} else if (!empty($imageType) && $imageType === 'room') {
    // Union with room images
    $imagesQuery = "SELECT 
                    ri.id, 
                    ri.image_path, 
                    ri.caption, 
                    ri.is_main, 
                    ri.created_at,
                    'room' as type,
                    h.name as hostel_name,
                    r.room_number as room_number
                    FROM room_images ri
                    JOIN rooms r ON ri.room_id = r.id
                    JOIN hostels h ON r.hostel_id = h.id
                    WHERE 1=1";
    
    if (!empty($hostelId)) {
        $imagesQuery .= " AND h.id = '" . mysqli_real_escape_string($conn, $hostelId) . "'";
    }
} else {
    // Get both hostel and room images
    $imagesQuery = "(SELECT 
                    hi.id, 
                    hi.image_path, 
                    hi.caption, 
                    hi.is_main, 
                    hi.created_at,
                    'hostel' as type,
                    h.name as hostel_name,
                    NULL as room_number
                    FROM hostel_images hi
                    JOIN hostels h ON hi.hostel_id = h.id
                    WHERE 1=1";
    
    if (!empty($hostelId)) {
        $imagesQuery .= " AND hi.hostel_id = '" . mysqli_real_escape_string($conn, $hostelId) . "'";
    }
    
    $imagesQuery .= ") UNION (SELECT 
                    ri.id, 
                    ri.image_path, 
                    ri.caption, 
                    ri.is_main, 
                    ri.created_at,
                    'room' as type,
                    h.name as hostel_name,
                    r.room_number as room_number
                    FROM room_images ri
                    JOIN rooms r ON ri.room_id = r.id
                    JOIN hostels h ON r.hostel_id = h.id
                    WHERE 1=1";
    
    if (!empty($hostelId)) {
        $imagesQuery .= " AND h.id = '" . mysqli_real_escape_string($conn, $hostelId) . "'";
    }
    
    $imagesQuery .= ") ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
}

$imagesQuery .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
```

### 4. JavaScript Enhancements
- Image preview before upload
- Drag and drop upload interface
- Progress indicators for uploads
- Image cropping functionality (optional)
- Bulk actions for image management
- Lightbox for image viewing

### 5. Security Considerations
- File type validation
- File size limits
- Sanitization of file names
- Prevention of malicious file uploads
- Access control for image management
- CSRF protection for forms

### 6. Performance Considerations
- Image resizing and optimization
- Lazy loading for image grids
- Pagination for large image collections
- Caching of frequently accessed images
- Efficient database queries

### 7. Responsive Design
- Mobile-friendly upload forms
- Adaptive image grids
- Touch-friendly image management
- Optimized image display for different screen sizes

### 8. Integration Points
- Hostel and room management systems
- User authentication and authorization
- Notification system for upload completion
- Backup and storage management