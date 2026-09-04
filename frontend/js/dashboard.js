// ==========================
// AUTH CHECK
// ==========================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// ==========================
// GET USER INFORMATION
// ==========================

const userData = localStorage.getItem("user");

let user = null;

if (userData) {
    user = JSON.parse(userData);
}


// ==========================
// WELCOME MESSAGE
// ==========================

const welcomeMessage = document.getElementById("welcomeMessage");

if (user) {
    welcomeMessage.textContent =
        `Welcome back, ${user.name} (${user.role})`;
}


// ==========================
// LOGOUT
// ==========================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
});


// ==========================
// DARK MODE
// ==========================

const themeToggle = document.getElementById("themeToggle");

const darkMode = localStorage.getItem("darkMode");

if (darkMode === "enabled") {

    document.body.classList.add("dark-mode");

    themeToggle.textContent = "Light Mode";
}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("darkMode", "enabled");

        themeToggle.textContent = "Light Mode";

    } else {

        localStorage.setItem("darkMode", "disabled");

        themeToggle.textContent = "Dark Mode";
    }
});