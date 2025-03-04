function toggleResetSection() {
    document.querySelector('.reset-section').style.display = 'block';
}

function resetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    if (newPassword) {
        alert('Password reset successfully! You can now log in with your new password.');
        // In real applications, save the new password securely in the backend here
    } else {
        alert('Please enter a new password.');
    }
}