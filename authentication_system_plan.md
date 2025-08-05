# User Authentication System Plan

## Overview
Implement a robust user authentication system with session management for the hostel booking system.

## Current Authentication Components
1. `backend/auth/login.php` - Login page
2. `backend/auth/register.php` - Registration page
3. `backend/auth/logout.php` - Logout functionality
4. `backend/includes/auth_middleware.php` - Authentication middleware
5. `backend/includes/functions.php` - Helper functions

## Authentication Flow

### 1. User Registration
- User visits registration page
- Fills out registration form (name, email, phone, password)
- Form validation on server-side
- Password hashing using `password_hash()`
- User data stored in database
- Welcome email (optional)
- Redirect to login page

### 2. User Login
- User visits login page
- Enters email and password
- Form validation on server-side
- Password verification using `password_verify()`
- Session creation with user data
- Redirect to appropriate dashboard based on role

### 3. Session Management
- Session timeout handling (30 minutes)
- Session regeneration for security
- Role-based access control
- Session data storage (user ID, name, email, role)

### 4. User Logout
- Destroy session
- Clear session cookies
- Redirect to login page

## Role-Based Access Control
1. **Student** - Can browse hostels, book rooms, view bookings
2. **Hostel Owner** - Can manage own hostels, rooms, view bookings
3. **Admin** - Can manage all users, hostels, rooms, bookings

## Security Features
- Password hashing with bcrypt
- Input sanitization
- CSRF protection (optional)
- Session fixation prevention
- SQL injection prevention (already using mysqli_real_escape_string)
- Rate limiting for login attempts (optional)

## Session Management Implementation

### Session Configuration
```php
// In config file
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_secure', 1); // If using HTTPS
session_set_cookie_params([
    'lifetime' => 1800, // 30 minutes
    'path' => '/',
    'domain' => '',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict'
]);
```

### Session Timeout Handling
- Check session creation time on each request
- Redirect to login if session expired
- Update session time on valid requests

### Authentication Middleware
- `requireLogin()` - Check if user is logged in
- `requireRole($role)` - Check if user has specific role
- `canAccessHostel($hostelId)` - Check if user can access specific hostel
- `getCurrentUserData()` - Get current user data from session

## Authentication Pages

### Login Page (`auth/login.php`)
- Email and password form
- Validation and error handling
- "Remember me" option (optional)
- Links to registration and password reset

### Registration Page (`auth/register.php`)
- Name, email, phone, password, confirm password form
- Validation and error handling
- Password strength requirements
- Email uniqueness check
- Links to login page

### Logout Handler (`auth/logout.php`)
- Session destruction
- Redirect to login page

## Integration with Existing System
- Maintain existing database structure
- Use existing helper functions where possible
- Preserve existing session handling
- Extend functionality as needed

## Error Handling
- Invalid credentials
- Account not found
- Account inactive
- Session expired
- Access denied

## User Experience
- Clear error messages
- Password strength indicators
- "Forgot password" functionality (optional)
- Account activation (optional)