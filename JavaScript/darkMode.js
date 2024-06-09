// darkmode.js
document.addEventListener("DOMContentLoaded", function() {
    const lightModeButton = document.getElementById("light-mode");
    const darkModeButton = document.getElementById("dark-mode");
    const body = document.body;

    darkModeButton.addEventListener("click", function() {
        body.classList.add("dark-mode");
        localStorage.setItem("mode", "dark");
    });

    lightModeButton.addEventListener("click", function() {
        body.classList.remove("dark-mode");
        localStorage.setItem("mode", "light");
    });

    const currentMode = localStorage.getItem("mode");
    if (currentMode === "dark") {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
    }
});
