# Frontend Structure Plan

## Overview
Convert the React frontend to server-side rendered PHP pages using HTML, JavaScript, and Bootstrap for styling.

## Directory Structure
```
frontend/
├── css/
│   ├── bootstrap.min.css
│   └── custom.css
├── js/
│   ├── bootstrap.bundle.min.js
│   ├── jquery.min.js
│   └── custom.js
├── images/
│   ├── hostels/
│   └── avatars/
├── includes/
│   ├── header.php
│   ├── footer.php
│   ├── navbar.php
│   └── sidebar.php
├── auth/
│   ├── login.php
│   └── register.php
├── hostels/
│   ├── index.php (listing page)
│   ├── view.php (detail page)
│   └── search.php (search results)
├── bookings/
│   ├── index.php (user bookings)
│   ├── create.php (booking form)
│   └── confirmation.php (confirmation page)
├── dashboard/
│   ├── student/
│   │   └── index.php
│   ├── owner/
│   │   └── index.php
│   └── admin/
│       └── index.php
├── profile/
│   └── index.php
├── notifications/
│   └── index.php
└── index.php (homepage)
```

## Key Pages

### 1. Homepage (`index.php`)
- Welcome message
- Search form for hostels
- Featured hostels
- Quick links to different sections

### 2. Hostel Listing Page (`hostels/index.php`)
- Filterable hostel listings
- Search by location, price range, amenities
- Pagination
- Hostel cards with basic info

### 3. Hostel Detail Page (`hostels/view.php`)
- Detailed hostel information
- Image gallery
- Room listings
- Contact information
- Booking button

### 4. Booking Pages (`bookings/`)
- Booking form with room selection
- Date selection
- User information
- Payment information
- Confirmation page

### 5. User Dashboard (`dashboard/student/index.php`)
- User profile information
- Current and past bookings
- Notifications
- Quick actions

### 6. Hostel Owner Dashboard (`dashboard/owner/index.php`)
- Hostel management
- Room management
- Booking requests
- Revenue statistics

### 7. Admin Dashboard (`dashboard/admin/index.php`)
- User management
- Hostel management
- Booking management
- System statistics

### 8. Authentication Pages
- Login page (`auth/login.php`)
- Registration page (`auth/register.php`)

## Bootstrap Components to Use
- Grid system for responsive layout
- Cards for hostel listings
- Navbars for navigation
- Forms for data input
- Modals for popups
- Tables for data display
- Buttons for actions
- Alerts for notifications

## JavaScript Functionality
- Form validation
- Dynamic content loading
- Image sliders/carousels
- Interactive filters
- AJAX for some operations (if needed)
- Client-side notifications

## CSS Customization
- Custom color scheme
- Responsive design adjustments
- Custom component styling
- Animation enhancements