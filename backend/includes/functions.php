<?php
require_once '../config/database.php';
require_once '../config/config.php';

function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

function sendError($message, $status = 400) {
    sendResponse(['error' => $message], $status);
}

function sendSuccess($data, $message = 'Success') {
    sendResponse(['success' => true, 'message' => $message, 'data' => $data]);
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    return preg_match('/^\+?[1-9]\d{1,14}$/', $phone);
}

function validateImage($file) {
    if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        return false;
    }
    if ($file['size'] > MAX_FILE_SIZE) {
        return false;
    }
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    return in_array($mimeType, ALLOWED_IMAGE_TYPES);
}

function generateToken($userId, $role) {
    $payload = [
        'user_id' => $userId,
        'role' => $role,
        'exp' => time() + (60 * 60 * 24)
    ];
    return base64_encode(json_encode($payload));
}

function verifyToken($token) {
    try {
        $payload = json_decode(base64_decode($token), true);
        if (!$payload || $payload['exp'] < time()) {
            return false;
        }
        return $payload;
    } catch (Exception $e) {
        return false;
    }
}

function getCurrentUser($conn) {
    $headers = getallheaders();
    $token = null;
    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
    }
    if (!$token) {
        return null;
    }
    $payload = verifyToken($token);
    if (!$payload) {
        return null;
    }
    $userId = sanitizeInput($conn, $payload['user_id']);
    $query = "SELECT id, name, email, phone, role, avatar FROM users WHERE id = '$userId'";
    $result = executeQuery($conn, $query);
    if (mysqli_num_rows($result) > 0) {
        return mysqli_fetch_assoc($result);
    }
    return null;
}

function hasPermission($user, $requiredRole) {
    if (!$user) {
        return false;
    }
    $roleHierarchy = [
        'student' => 1,
        'hostel_owner' => 2,
        'admin' => 3
    ];
    return $roleHierarchy[$user['role']] >= $roleHierarchy[$requiredRole];
}
?>