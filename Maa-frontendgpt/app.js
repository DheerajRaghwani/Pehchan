const API_BASE = "http://localhost:7003/api/UserLogin/login";

async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("loginError");

    errorBox.textContent = ""; // Clear error

    if (!username || !password) {
        errorBox.textContent = "Please enter both username and password.";
        return;
    }

    const reqBody = {
        userName: username,
        password: password
    };

    try {
        const response = await fetch(API_BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reqBody)
        });

        if (!response.ok) {
            const errText = await response.text();
            errorBox.textContent = errText || "Invalid username or password.";
            return;
        }

        const data = await response.json();

        // Save token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const role = data.user.loginRole?.toLowerCase();

        // Redirect based on LoginRole
        if (role === "admin") {
            window.location.href = "dashboard.html";
        } 
        
        else {
            window.location.href = "child-entry.html"; // default page
        }

    } catch (error) {
        console.error("Login error:", error);
        errorBox.textContent = "Server error. Try again later.";
    }
}
