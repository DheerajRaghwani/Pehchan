// Base API URL
const apiUrl = "https://pehchanapi.rdmp.in/api/Userlogin";

// Get token from login (assumes you stored it after login)
function getToken() {
	return localStorage.getItem("jwtToken") || "";
}

// DOM elements
const userListWrap = document.getElementById("userListWrap");
const userCount = document.getElementById("userCount");

// Message display
function showMessage(msg, type = "success") {
	let msgDiv = document.getElementById("adminMsg");
	if (!msgDiv) {
		msgDiv = document.createElement("div");
		msgDiv.id = "adminMsg";
		msgDiv.style.marginTop = "8px";
		document.querySelector(".content").prepend(msgDiv);
	}
	msgDiv.textContent = msg;
	msgDiv.style.color = type === "success" ? "green" : "red";
	setTimeout(() => {
		msgDiv.textContent = "";
	}, 4000);
}

// Escape HTML to prevent XSS
function escapeHtml(s) {
	return (s || "")
		.toString()
		.replace(
			/[&<>"']/g,
			(c) =>
				({
					"&": "&amp;",
					"<": "&lt;",
					">": "&gt;",
					'"': "&quot;",
					"'": "&#39;",
				}[c])
		);
}

// Helper for fetch with JWT
async function apiFetch(url, options = {}) {
	const token = getToken();
	options.headers = {
		...options.headers,
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
	const response = await fetch(url, options);
	if (response.status === 401) {
		showMessage("Unauthorized! Please login again.", "error");
		throw new Error("401 Unauthorized");
	}
	return response;
}

// Render all users
async function renderUsers() {
	try {
		const response = await apiFetch(`${apiUrl}/GetAll`);
		if (!response.ok) throw new Error(`Server error: ${response.status}`);
		const users = await response.json();

		if (!users || users.length === 0) {
			userListWrap.innerHTML = '<div class="muted">No users yet</div>';
			userCount.textContent = 0;
			return;
		}

		let html =
			"<table><thead><tr><th>Username</th><th>Role</th><th>Actions</th></tr></thead><tbody>";
		users.forEach((u) => {
			html += `<tr>
        <td>${escapeHtml(u.userName)}</td>
        <td>${escapeHtml(u.loginRole)}</td>
        <td><button onclick="deleteUser(${
					u.id
				})" style="background:#ef4444;padding:6px 8px;border-radius:6px">Delete</button></td>
      </tr>`;
		});
		html += "</tbody></table>";
		userListWrap.innerHTML = html;
		userCount.textContent = users.length;
	} catch (err) {
		console.error(err);
		userListWrap.innerHTML =
			'<div class="muted">Error loading users. Check API/CORS or token.</div>';
	}
}

// Create new user
async function createUser() {
	const username = document.getElementById("u_username").value.trim();
	const password = document.getElementById("u_password").value.trim();
	const role = document.getElementById("u_role").value;

	if (!username || !password) {
		showMessage("Please provide username and password", "error");
		return;
	}

	const payload = { UserName: username, Password: password, LoginRole: role };

	try {
		const response = await apiFetch(`${apiUrl}/Add`, {
			method: "POST",
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errText = await response.text();
			throw new Error(errText || `Server error: ${response.status}`);
		}

		showMessage("User created successfully", "success");
		document.getElementById("u_username").value = "";
		document.getElementById("u_password").value = "";
		renderUsers();
	} catch (err) {
		console.error(err);
		showMessage("Error creating user: " + err.message, "error");
	}
}

// Delete user
async function deleteUser(id) {
	if (!confirm("Are you sure you want to delete this user?")) return;

	try {
		const response = await apiFetch(`${apiUrl}/Delete/${id}`, {
			method: "DELETE",
		});
		if (!response.ok)
			throw new Error(`Failed to delete user (status ${response.status})`);

		showMessage("User deleted successfully", "success");
		renderUsers();
	} catch (err) {
		console.error(err);
		showMessage("Error deleting user: " + err.message, "error");
	}
}

// Seed sample users (for demo)
async function seedSample() {
	const sampleUsers = [
		{ UserName: "admin1", Password: "admin123", LoginRole: "admin" },
		{ UserName: "user1", Password: "user123", LoginRole: "user" },
	];

	for (const u of sampleUsers) {
		try {
			await apiFetch(`${apiUrl}/Add`, {
				method: "POST",
				body: JSON.stringify(u),
			});
		} catch (err) {
			console.error("Error seeding user:", u, err);
		}
	}

	showMessage("Sample users seeded", "success");
	renderUsers();
}

// Clear all users
async function clearUsers() {
	if (!confirm("Clear all users?")) return;

	try {
		const response = await apiFetch(`${apiUrl}/ClearAll`, { method: "DELETE" });
		if (!response.ok) throw new Error("Failed to clear users");

		showMessage("All users cleared", "success");
		renderUsers();
	} catch (err) {
		console.error(err);
		showMessage("Error clearing users: " + err.message, "error");
	}
}

// Logout
function logout() {
	localStorage.removeItem("jwtToken");
	alert("Logging out...");
	window.location.href = "login.html";
}

// Initialize
document.addEventListener("DOMContentLoaded", renderUsers);

// ------------------------------------------
// 4️⃣ LOGIN CHECK
// ------------------------------------------
function checkLogin() {
	const token = localStorage.getItem("jwtToken");
	if (!token) {
		alert("Session expired! Please login again.");
		window.location.href = "login.html";
	}
}
