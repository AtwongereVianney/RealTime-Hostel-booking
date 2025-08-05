<?php
session_start();

// Check if user is logged in
function requireLogin() {
    if (!isset($_SESSION['user_id'])) {
        header('Location: ../../auth/login.php');
        exit();
    }
}

// Check if user has specific role
function requireRole($requiredRole) {
    requireLogin();
    
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== $requiredRole) {
        // For admin pages, allow both admin and hostel_owner
        if ($requiredRole === 'admin' && in_array($_SESSION['user_role'], ['admin', 'hostel_owner'])) {
            return true;
        }
        
        // Redirect to appropriate dashboard or show error
        if ($_SESSION['user_role'] === 'admin' || $_SESSION['user_role'] === 'hostel_owner') {
            header('Location: ../admin/');
        } else {
            header('Location: ../student/');
        }
        exit();
    }
    
    return true;
}

// Check if user can access specific hostel (owner or admin)
function canAccessHostel($hostelId) {
    require_once '../config/database.php';
    
    $conn = getDBConnection();
    $hostelId = sanitizeInput($conn, $hostelId);
    
    $query = "SELECT owner_id FROM hostels WHERE id = '$hostelId'";
    $result = executeQuery($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        $hostel = mysqli_fetch_assoc($result);
        closeDBConnection($conn);
        
        // Admin can access any hostel, owner can only access their own
        return $_SESSION['user_role'] === 'admin' || $hostel['owner_id'] === $_SESSION['user_id'];
    }
    
    closeDBConnection($conn);
    return false;
}

// Get current user data
function getCurrentUserData() {
    if (!isset($_SESSION['user_id'])) {
        return null;
    }
    
    return [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name'],
        'email' => $_SESSION['user_email'],
        'role' => $_SESSION['user_role'],
        'avatar' => $_SESSION['user_avatar'] ?? null
    ];
}

// Check session timeout (30 minutes)
function checkSessionTimeout() {
    $timeout = 30 * 60; // 30 minutes in seconds
    
    if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > $timeout) {
        // Session expired
        session_destroy();
        header('Location: ../../auth/login.php?expired=1');
        exit();
    }
    
    // Update login time
    $_SESSION['login_time'] = time();
}
?> 