# Backend Conversion Plan

## Overview
Convert existing API endpoints to server-side rendered PHP pages while maintaining the same functionality.

## Current API Endpoints
1. `backend/api/hostels/get_hostels.php` - Get hostel listings
2. `backend/api/hostels/create_hostel.php` - Create new hostel
3. `backend/api/hostels/upload_hostel_image.php` - Upload hostel images
4. `backend/api/rooms/get_rooms.php` - Get rooms for a hostel
5. `backend/api/rooms/upload_room_image.php` - Upload room images

## Conversion Strategy
Instead of returning JSON, these endpoints will render HTML pages directly.

## New Page Structure

### 1. Hostel Management Pages
- `backend/pages/hostels/index.php` - List all hostels (replaces get_hostels.php)
- `backend/pages/hostels/create.php` - Create new hostel form (replaces create_hostel.php)
- `backend/pages/hostels/edit.php` - Edit existing hostel
- `backend/pages/hostels/view.php` - View hostel details

### 2. Room Management Pages
- `backend/pages/rooms/index.php` - List rooms for a hostel (replaces get_rooms.php)
- `backend/pages/rooms/create.php` - Create new room
- `backend/pages/rooms/edit.php` - Edit existing room

### 3. Image Management Pages
- `backend/pages/images/hostel_upload.php` - Upload hostel images (replaces upload_hostel_image.php)
- `backend/pages/images/room_upload.php` - Upload room images (replaces upload_room_image.php)
- `backend/pages/images/manage.php` - Manage all images

## Implementation Details

### Hostel Listing Page (`backend/pages/hostels/index.php`)
- Server-side data fetching using existing database functions
- Render HTML table or card layout with hostel information
- Include filtering options (location, price range, amenities)
- Pagination support

### Hostel Creation Page (`backend/pages/hostels/create.php`)
- HTML form for hostel creation
- Server-side form processing
- Image upload handling
- Validation and error handling
- Redirect to hostel listing on success

### Room Listing Page (`backend/pages/rooms/index.php`)
- Server-side data fetching for rooms of a specific hostel
- Render HTML table with room information
- Include status indicators
- Links to edit rooms

### Image Upload Pages
- HTML forms for image uploads
- Server-side processing using existing upload functions
- Integration with existing database storage

## Data Flow
1. User requests page
2. PHP script processes request
3. Database queries executed using existing mysqli functions
4. Data processed and formatted
5. HTML page rendered with data
6. Page sent to client browser

## Security Considerations
- Maintain existing authentication checks
- Preserve input sanitization
- Keep file upload validation
- Maintain role-based access control

## Performance Considerations
- Use existing database connection functions
- Implement pagination for large datasets
- Cache frequently accessed data if needed
- Optimize database queries