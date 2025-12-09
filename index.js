// URL of your API
const API_URL = "http://93.127.131.135:6700/Missenger";

// Select elements
const loginInputs = document.querySelectorAll(".logininput");
const loginButton = document.querySelector(".FakeButton");

// Optional: show status to the user
const statusDiv = document.createElement("div");
statusDiv.style.marginTop = "10px";
document.querySelector(".loginframe").appendChild(statusDiv);

// Function to update status
function setStatus(message) {
    statusDiv.textContent = message;
}

// Check if user is already logged in
window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
        setStatus("Logged in as " + username);
        // Optionally redirect to messaging page
    } else {
        setStatus("Not logged in");
    }
});

// Handle login button click
loginButton.addEventListener("click", async () => {
    const email = loginInputs[0].value.trim();
    const password = loginInputs[1].value.trim();

    if (!email || !password) {
        setStatus("Please enter both email and password");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/Login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password: password })
        });

        if (!response.ok) {
            const text = await response.text();
            setStatus("Login failed: " + text);
            return;
        }

        const data = await response.json();
        const token = data.token;

        // Store token and username in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("username", email);

        setStatus("Logged in as " + email);

        // Optionally, redirect to messaging page
        // window.location.href = "messaging.html";

    } catch (err) {
        setStatus("Error: " + err.message);
    }
});

// Optional: function to log out
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setStatus("Logged out");
}
