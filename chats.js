const loginButton = document.querySelector(".LogOutButton");

loginButton.addEventListener("click", async () => {
    logout();
});

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "index.html"
    setStatus("Logged out");
}
