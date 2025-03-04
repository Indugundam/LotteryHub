document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            // event.preventDefault(); // REMOVE this line

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Please enter both username and password.");
                event.preventDefault();
                return;
            }
        });
    }
});


// Logout function
function logout() {
    fetch("LogoutServlet", { method: "POST" }) // Call a logout servlet
        .then(() => {
            window.location.href = "login.html"; // Redirect to login page
        })
        .catch(error => console.error("Error:", error));
}
