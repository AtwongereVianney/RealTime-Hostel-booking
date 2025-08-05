<?php
require_once '../config/database.php';
require_once '../config/config.php';

function uploadImage($file, $folder) {
    if (!validateImage($file)) {
        return false;
    }
    $uploadDir = UPLOAD_PATH . $folder . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return $folder . '/' . $filename;
    }
    return false;
}

function deleteImage($imagePath) {
    $fullPath = UPLOAD_PATH . $imagePath;
    if (file_exists($fullPath)) {
        return unlink($fullPath);
    }
    return false;
}
?>