const apiUrl = "https://pehchanapi.rdmp.in/api/UserLogin/login";

async function login() {
	const username = document.getElementById("username").value.trim();
	const password = document.getElementById("password").value.trim();
	const errorBox = document.getElementById("loginError");

	errorBox.textContent = "";

	if (!username || !password) {
		errorBox.textContent = "Please enter username and password.";
		return;
	}

	try {
		const response = await fetch(apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				UserName: username, // Must match C# LoginRequest
				Password: password,
			}),
		});

		if (!response.ok) {
			const text = await response.text();
			errorBox.textContent = text || "Login failed";
			return;
		}

		const data = await response.json();
		console.log("Backend response:", data); // Debug LoginRole

		const user = data.user;
		const role = user.loginRole?.trim().toUpperCase();

		localStorage.setItem("jwtToken", data.token);
		localStorage.setItem("user", JSON.stringify(user));

		if (role === "ADMIN") window.location.href = "Admindashboard.html";
		else if (role === "USER") window.location.href = "dashboard.html";
		else errorBox.textContent = "Unknown role: " + user.LoginRole;
	} catch (err) {
		errorBox.textContent = "Error connecting to server: " + err.message;
	}
}
