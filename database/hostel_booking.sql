-- Hostel Booking System Database Schema
CREATE DATABASE IF NOT EXISTS hostel_booking;
USE hostel_booking;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'hostel_owner', 'admin') DEFAULT 'student',
    avatar VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hostels table
CREATE TABLE hostels (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    owner_id VARCHAR(36) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Hostel images table
CREATE TABLE hostel_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id VARCHAR(36) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    is_main BOOLEAN DEFAULT FALSE,
    uploaded_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hostel_id) REFERENCES hostels(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Rooms table
CREATE TABLE rooms (
    id VARCHAR(36) PRIMARY KEY,
    hostel_id VARCHAR(36) NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    type ENUM('single', 'double', 'triple', 'quad') NOT NULL,
    capacity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hostel_id) REFERENCES hostels(id)
);

-- Room images table
CREATE TABLE room_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id VARCHAR(36) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    is_main BOOLEAN DEFAULT FALSE,
    uploaded_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Bookings table
CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY,
    room_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('pending', 'partial', 'paid') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('booking', 'payment', 'chat', 'system') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (id, name, email, phone, password, role) VALUES
('user_1', 'John Doe', 'john@example.com', '+1234567890', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('user_2', 'Jane Smith', 'jane@example.com', '+1234567891', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'hostel_owner'),
('user_3', 'Admin User', 'admin@example.com', '+1234567892', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

INSERT INTO hostels (id, name, description, location, owner_id) VALUES
('hostel_1', 'Sunset Student Residence', 'Modern student accommodation with great amenities', 'Fort Portal', 'user_2'),
('hostel_2', 'Mountain View Hostel', 'Affordable student housing near the university', 'Fort Portal', 'user_2');

INSERT INTO rooms (id, hostel_id, room_number, type, capacity, price, description, status) VALUES
('room_1', 'hostel_1', '101', 'single', 1, 150000.00, 'Comfortable single room with private bathroom', 'available'),
('room_2', 'hostel_1', '102', 'double', 2, 200000.00, 'Spacious double room with shared bathroom', 'available'),
('room_3', 'hostel_2', '201', 'single', 1, 120000.00, 'Basic single room with shared facilities', 'available'),
('room_4', 'hostel_2', '202', 'triple', 3, 250000.00, 'Large triple room with private bathroom', 'available');

INSERT INTO bookings (id, room_id, user_id, check_in_date, check_out_date, total_amount, deposit_amount, status) VALUES
('booking_1', 'room_1', 'user_1', '2024-02-01', '2024-05-31', 600000.00, 150000.00, 'confirmed'),
('booking_2', 'room_3', 'user_1', '2024-03-01', '2024-06-30', 480000.00, 120000.00, 'pending');

INSERT INTO notifications (id, user_id, title, message, type) VALUES
('notif_1', 'user_1', 'Booking Confirmed', 'Your room booking at Sunset Student Residence has been confirmed!', 'booking'),
('notif_2', 'user_1', 'Payment Reminder', 'Please complete your deposit payment for Mountain View Hostel', 'payment'); 