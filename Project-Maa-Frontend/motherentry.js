// motherentry.js

const apiUrl = "https://pehchanapi.rdmp.in/api/Motherschemerecord";

// Get JWT token
function getToken() {
	return localStorage.getItem("jwtToken") || "";
}

// Message display
function showMessage(msg, type = "success") {
	const msgBox = document.getElementById("childMsg");
	msgBox.textContent = msg;
	msgBox.style.color = type === "success" ? "green" : "red";
	setTimeout(() => {
		msgBox.textContent = "";
	}, 4000);
}

// Escape HTML
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

// Save Mother Record
async function saveChild() {
	const form = document.getElementById("childForm");

	const model = {
		District: escapeHtml(document.getElementById("District").value.trim()),
		HealthBlock: escapeHtml(
			document.getElementById("HealthBlock").value.trim()
		),
		HealthFacility: escapeHtml(
			document.getElementById("HealthFacility").value.trim()
		),
		HealthSubFacility: escapeHtml(
			document.getElementById("HealthSubFacility").value.trim()
		),
		Village: escapeHtml(document.getElementById("Village").value.trim()),
		Rchid: document.getElementById("RCHID").value.trim(),
		MotherName: escapeHtml(document.getElementById("MotherName").value.trim()),
		HusbandName: escapeHtml(
			document.getElementById("HusbandName").value.trim()
		),
		Mobileof: escapeHtml(document.getElementById("Mobileof").value.trim()),
		MobileNo: escapeHtml(document.getElementById("MobileNo").value.trim()),
		AgeAsPerRegistration: escapeHtml(
			document.getElementById("AgeasperRegistration").value.trim()
		),
		MotherBirthDate: document.getElementById("Delivery").value,
		Address: escapeHtml(document.getElementById("Address").value.trim()),
		Anmname: escapeHtml(document.getElementById("ANMName").value.trim()),
		Ashaname: escapeHtml(document.getElementById("ASHAName").value.trim()),
		RegistrationDate: document.getElementById("RegistrationDate").value,
		Lmd: document.getElementById("LMP").value,
		Edd: document.getElementById("EDD").value,
	};

	// Required fields validation
	const requiredFields = [
		"District",
		"HealthBlock",
		"HealthFacility",
		"HealthSubFacility",
		"Village",
		"Rchid",
		"MotherName",
		"MobileNo",
		"Anmname",
		"Ashaname",
	];

	for (const field of requiredFields) {
		if (!model[field]) {
			showMessage(`Please fill all required fields: ${field}`, "error");
			return;
		}
	}

	try {
		const response = await fetch(`${apiUrl}/Add`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${getToken()}`,
			},
			body: JSON.stringify(model),
		});

		if (response.status === 401) {
			showMessage("Unauthorized! Please login again.", "error");
			setTimeout(() => (window.location.href = "login.html"), 1500);
			return;
		}

		const result = await response.json();

		if (response.ok) {
			showMessage(result.message || "Record added successfully");
			form.reset();
		} else {
			showMessage(result.message || "Something went wrong", "error");
		}
	} catch (err) {
		console.error("Fetch error:", err);
		showMessage("Fetch failed. Check console for details.", "error");
	}
}

// Reset form
function resetChildForm() {
	document.getElementById("childForm").reset();
	document.getElementById("childMsg").textContent = "";
}

// Check login
function checkLogin() {
	if (!getToken()) window.location.href = "login.html";
}

// Logout
function logout() {
	localStorage.removeItem("jwtToken");
	localStorage.removeItem("user");
	window.location.href = "login.html";
}

// Init
document.addEventListener("DOMContentLoaded", checkLogin);
