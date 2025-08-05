# Hostel Listing Page Plan

## Overview
Create a server-side rendered hostel listing page with filtering capabilities using HTML, JavaScript, and Bootstrap.

## Page Structure
- `frontend/hostels/index.php` - Main hostel listing page
- `frontend/hostels/search.php` - Search results page (optional)

## Features
1. Hostel listings in card format
2. Filtering by location, price range, amenities
3. Search by name or location
4. Pagination for large result sets
5. Sorting options (price, rating, name)

## Implementation Details

### 1. Data Fetching
- Server-side database queries using mysqli
- Join hostels, hostel_images, and hostel_amenities tables
- Filter results based on user input
- Pagination implementation

### 2. Filtering Options
- Location filter (text input)
- Price range slider (min/max)
- Amenities checkboxes (Wi-Fi, Security, Water, etc.)
- Room type filter (single, double, triple, quad)

### 3. Display Format
- Bootstrap cards for each hostel
- Main image display
- Hostel name and location
- Price information
- Amenities display
- Rating and review count
- "View Rooms" button

### 4. Search Form
```html
<form method="GET" action="index.php">
    <div class="row">
        <div class="col-md-3">
            <input type="text" name="location" class="form-control" placeholder="Location" value="<?php echo htmlspecialchars($_GET['location'] ?? ''); ?>">
        </div>
        <div class="col-md-3">
            <input type="number" name="min_price" class="form-control" placeholder="Min Price" value="<?php echo htmlspecialchars($_GET['min_price'] ?? ''); ?>">
        </div>
        <div class="col-md-3">
            <input type="number" name="max_price" class="form-control" placeholder="Max Price" value="<?php echo htmlspecialchars($_GET['max_price'] ?? ''); ?>">
        </div>
        <div class="col-md-3">
            <button type="submit" class="btn btn-primary">Filter</button>
            <a href="index.php" class="btn btn-secondary">Reset</a>
        </div>
    </div>
    
    <div class="row mt-3">
        <div class="col-md-12">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" name="amenities[]" value="Wi-Fi" id="wifi">
                <label class="form-check-label" for="wifi">Wi-Fi</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" name="amenities[]" value="Security" id="security">
                <label class="form-check-label" for="security">Security</label>
            </div>
            <!-- More amenities checkboxes -->
        </div>
    </div>
</form>
```

### 5. Hostel Card Component
```html
<div class="col-md-4 mb-4">
    <div class="card h-100">
        <img src="<?php echo htmlspecialchars($hostel['main_image']); ?>" class="card-img-top" alt="<?php echo htmlspecialchars($hostel['name']); ?>" style="height: 200px; object-fit: cover;">
        <div class="card-body">
            <h5 class="card-title"><?php echo htmlspecialchars($hostel['name']); ?></h5>
            <p class="card-text">
                <i class="fas fa-map-marker-alt"></i> <?php echo htmlspecialchars($hostel['location']); ?>
            </p>
            <p class="card-text">
                <strong><?php echo formatCurrency($hostel['price']); ?></strong> per semester
            </p>
            <div class="mb-2">
                <?php foreach ($hostel['amenities'] as $amenity): ?>
                    <span class="badge bg-secondary"><?php echo htmlspecialchars($amenity); ?></span>
                <?php endforeach; ?>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="text-warning">
                        <?php for ($i = 1; $i <= 5; $i++): ?>
                            <?php if ($i <= $hostel['rating']): ?>
                                <i class="fas fa-star"></i>
                            <?php else: ?>
                                <i class="far fa-star"></i>
                            <?php endif; ?>
                        <?php endfor; ?>
                    </span>
                    <span class="text-muted">(<?php echo $hostel['reviews']; ?> reviews)</span>
                </div>
                <a href="view.php?id=<?php echo $hostel['id']; ?>" class="btn btn-primary">View Rooms</a>
            </div>
        </div>
    </div>
</div>
```

### 6. Database Query
```php
// Build dynamic query based on filters
$query = "SELECT h.*, 
                 COUNT(DISTINCT r.id) as total_rooms,
                 COUNT(DISTINCT CASE WHEN r.status = 'available' THEN r.id END) as available_rooms,
                 GROUP_CONCAT(DISTINCT ha.amenity) as amenities
          FROM hostels h
          LEFT JOIN rooms r ON h.id = r.hostel_id
          LEFT JOIN hostel_amenities ha ON h.id = ha.hostel_id
          LEFT JOIN hostel_images hi ON h.id = hi.hostel_id AND hi.is_main = 1
          WHERE h.status = 'active'";

// Add filters
if (!empty($location)) {
    $query .= " AND h.location LIKE '%" . mysqli_real_escape_string($conn, $location) . "%'";
}

if (!empty($minPrice)) {
    $query .= " AND h.price >= " . (int)$minPrice;
}

if (!empty($maxPrice)) {
    $query .= " AND h.price <= " . (int)$maxPrice;
}

// Add amenities filter
if (!empty($amenities)) {
    foreach ($amenities as $amenity) {
        $query .= " AND ha.amenity = '" . mysqli_real_escape_string($conn, $amenity) . "'";
    }
}

$query .= " GROUP BY h.id ORDER BY h.created_at DESC";

// Add pagination
$limit = 9; // 3 rows of 3 cards
$offset = ($page - 1) * $limit;
$query .= " LIMIT $limit OFFSET $offset";
```

### 7. Pagination
```html
<nav aria-label="Hostel listings pagination">
    <ul class="pagination justify-content-center">
        <?php if ($page > 1): ?>
            <li class="page-item">
                <a class="page-link" href="?page=<?php echo $page - 1; ?>&<?php echo http_build_query($_GET); ?>">Previous</a>
            </li>
        <?php endif; ?>
        
        <?php for ($i = 1; $i <= $totalPages; $i++): ?>
            <li class="page-item <?php echo $i == $page ? 'active' : ''; ?>">
                <a class="page-link" href="?page=<?php echo $i; ?>&<?php echo http_build_query($_GET); ?>"><?php echo $i; ?></a>
            </li>
        <?php endfor; ?>
        
        <?php if ($page < $totalPages): ?>
            <li class="page-item">
                <a class="page-link" href="?page=<?php echo $page + 1; ?>&<?php echo http_build_query($_GET); ?>">Next</a>
            </li>
        <?php endif; ?>
    </ul>
</nav>
```

## JavaScript Enhancements
- Live filtering as user types (optional)
- Price range slider using Bootstrap slider plugin
- AJAX for loading more results (optional)
- Image lazy loading

## Responsive Design
- Grid layout that adapts to different screen sizes
- Mobile-friendly filters
- Touch-friendly elements

## Performance Considerations
- Efficient database queries
- Caching of frequently accessed data
- Image optimization
- Pagination for large datasets