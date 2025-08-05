<?php
require_once '../includes/functions.php';

session_start();

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    $role = $_SESSION['user_role'];
    if ($role === 'admin' || $role === 'hostel_owner') {
        header('Location: ../dashboards/admin/');
    } else {
        header('Location: ../dashboards/student/');
    }
    exit();
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $conn = getDBConnection();
    
    $name = sanitizeInput($conn, $_POST['name']);
    $email = sanitizeInput($conn, $_POST['email']);
    $phone = sanitizeInput($conn, $_POST['phone']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $role = sanitizeInput($conn, $_POST['role']);
    
    // Validation
    if (empty($name) || empty($email) || empty($password) || empty($confirm_password)) {
        $error = 'All fields are required';
    } elseif (!validateEmail($email)) {
        $error = 'Please enter a valid email address';
    } elseif (!empty($phone) && !validatePhone($phone)) {
        $error = 'Please enter a valid phone number';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters long';
    } elseif ($password !== $confirm_password) {
        $error = 'Passwords do not match';
    } elseif (!in_array($role, ['student', 'hostel_owner'])) {
        $error = 'Invalid role selected';
    } else {
        // Check if email already exists
        $checkQuery = "SELECT id FROM users WHERE email = '$email'";
        $checkResult = executeQuery($conn, $checkQuery);
        
        if (mysqli_num_rows($checkResult) > 0) {
            $error = 'Email address already registered';
        } else {
            // Hash password
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            
            // Generate user ID
            $userId = uniqid('user_', true);
            
            // Insert new user
            $insertQuery = "INSERT INTO users (id, name, email, phone, password, role, created_at) 
                           VALUES ('$userId', '$name', '$email', '$phone', '$hashedPassword', '$role', NOW())";
            
            if (executeQuery($conn, $insertQuery)) {
                $success = 'Registration successful! You can now login.';
                // Clear form data
                $name = $email = $phone = '';
            } else {
                $error = 'Registration failed. Please try again.';
            }
        }
    }
    
    closeDBConnection($conn);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - <?php echo APP_NAME; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Join our hostel booking platform
                </p>
            </div>
            
            <?php if ($error): ?>
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>
            
            <?php if ($success): ?>
                <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    <?php echo htmlspecialchars($success); ?>
                </div>
            <?php endif; ?>
            
            <form class="mt-8 space-y-6" method="POST">
                <div class="space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                        <input id="name" name="name" type="text" required value="<?php echo isset($name) ? htmlspecialchars($name) : ''; ?>"
                               class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                        <input id="email" name="email" type="email" required value="<?php echo isset($email) ? htmlspecialchars($email) : ''; ?>"
                               class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                        <input id="phone" name="phone" type="tel" value="<?php echo isset($phone) ? htmlspecialchars($phone) : ''; ?>"
                               class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    
                    <div>
                        <label for="role" class="block text-sm font-medium text-gray-700">Account Type</label>
                        <select id="role" name="role" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select account type</option>
                            <option value="student" <?php echo (isset($role) && $role === 'student') ? 'selected' : ''; ?>>Student</option>
                            <option value="hostel_owner" <?php echo (isset($role) && $role === 'hostel_owner') ? 'selected' : ''; ?>>Hostel Owner</option>
                        </select>
                    </div>
                    
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" name="password" type="password" required
                               class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    
                    <div>
                        <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input id="confirm_password" name="confirm_password" type="password" required
                               class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                </div>

                <div>
                    <button type="submit" 
                            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Create Account
                    </button>
                </div>
                
                <div class="text-center">
                    <a href="login.php" class="text-sm text-indigo-600 hover:text-indigo-500">
                        Already have an account? Sign in here
                    </a>
                </div>
            </form>
        </div>
    </div>
</body>
</html> 