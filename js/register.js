// Clear previous error messages
function clearErrors() {
    document.getElementById("emailError").textContent = '';
    document.getElementById("phoneError").textContent = '';
    document.getElementById("passwordError").textContent = '';
    document.getElementById("confirmPasswordError").textContent = '';
}

// Validate email format
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[gmail||outlook]+\.[com]{2,}$/;
    return emailPattern.test(email);
}

function register() {
    // Clear previous error messages
    clearErrors();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    let valid = true;

    // Email validation
    if (!validateEmail(email)) {
        document.getElementById("emailError").textContent = "Please enter a valid email address.";
        valid = false;
    }

    // Phone number validation
    if (!/^\d{10}$/.test(phone)) {
        document.getElementById("phoneError").textContent = "Phone number should be exactly 10 digits.";
        valid = false;
    }

    // Password match validation
    if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
        valid = false;
    }

    // Password strength validation
    if (!/(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}/.test(password)) {
        document.getElementById("passwordError").textContent = "Password must be at least 8 characters long, include at least one number and one uppercase letter.";
        valid = false;
    }

    if (valid) {
        // Save user data in localStorage
        const user = {
            username,
            password,
            email,
            phone
        };
        localStorage.setItem(username, JSON.stringify(user));

        alert('Registration successful!');
        window.location.href = "login.html"; // Redirect to login page
    }
}
