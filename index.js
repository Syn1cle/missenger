const API_URL = "http://93.127.131.135:6700/Missenger";

const loginInputs = document.querySelectorAll(".logininput");
const loginButton = document.querySelector(".Logintext");

const statusDiv = document.createElement("div");
statusDiv.style.marginTop = "10px";
document.querySelector(".loginframe").appendChild(statusDiv);

function setStatus(message) {
  statusDiv.textContent = message;
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (token && username) {
    setStatus("Logged in as " + username);

    if (!window.location.pathname.endsWith("chats.html")) {
      window.location.href = "chats.html";
    }
  } else {
    setStatus("Not logged in");
  }
});

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
      body: JSON.stringify({ username: email, password: password }),
    });

    if (!response.ok) {
      const text = await response.text();
      setStatus("Login failed: " + text);
      return;
    }

    const data = await response.json();
    const token = data.token;

    localStorage.setItem("token", token);
    localStorage.setItem("username", email);

    setStatus("Logged in as " + email);
    window.location.href = "chats.html";
  } catch (err) {
    setStatus("Error: " + err.message);
  }
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  setStatus("Logged out");

  window.location.href = "index.html";
}

//❯ curl -X POST http://93.127.131.135:6700/Missenger/Register   -H "Content-Type: application/json"   -d '{
//    "username": "testuser",
//    "password": "testpass"
//  }'
