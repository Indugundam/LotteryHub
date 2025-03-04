window.onload = function () {
    setTimeout(() => {
        const loginContainer = document.getElementById('loginContainer');
        loginContainer.classList.add('active');
    }, 3000);
};

// Close the login container
function closeLogin() {
    const loginContainer = document.getElementById('loginContainer');
    loginContainer.classList.remove('active');
}

// Validate login form
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    let isValid = true;

    // Clear previous errors
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    // Validate username
    if (username === '') {
        document.getElementById('usernameError').textContent = 'Username is required';
        isValid = false;
    }

    // Validate password
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Password is required';
        isValid = false;
    }

    // If valid, proceed with login (placeholder logic)
    const userData = localStorage.getItem(username);

    if (userData) {
        const user = JSON.parse(userData);

        // Validate username or mobile and password
        if ((username === user.username) && password === user.password) {
            alert("Login successful!");
            window.location.href = "about.html"; // Redirect to the home page
        } else {
            alert("Invalid credentials. Please try again.");
        }
    } else {
        alert("User not found. Please register first.");
    }

});

