// ================================
// Matritva Bhatta Yojana JS
// ================================

const apiBase = "https://pehchanapi.rdmp.in/api/Motherschemerecord";

// DOM Elements
const bcSearchInput = document.getElementById("bcSearchInput");
const bcRecordBox = document.getElementById("bcRecordBox");
const remarkInput = document.getElementById("remark");
const remarkMsg = document.getElementById("remarkMsg");
const beneficiaryStatus = document.getElementById("beneficiaryStatus");

// Track current record
let currentRCHID = null;
let currentPmmvy = null;

// -----------------------------
// 1️⃣ CHECK LOGIN
// -----------------------------
function checkLogin() {
	const token = localStorage.getItem("jwtToken");
	if (!token) {
		alert("Session expired! Please login again.");
		window.location.href = "login.html";
	}
}

// -----------------------------
// 2️⃣ SEARCH RCH RECORD
// -----------------------------
async function searchBC() {
	const rchid = bcSearchInput.value.trim();
	bcRecordBox.innerHTML = "";
	remarkMsg.textContent = "";
	beneficiaryStatus.textContent = "";
	remarkInput.value = "";

	if (!rchid) {
		bcRecordBox.innerHTML = "<p class='muted'>Please enter RCH ID.</p>";
		return;
	}

	try {
		const token = localStorage.getItem("jwtToken");
		const response = await fetch(`${apiBase}/GetByRCHID/${rchid}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...(token && { Authorization: `Bearer ${token}` }),
			},
		});

		if (!response.ok) {
			bcRecordBox.innerHTML = "<p class='muted'>No record found.</p>";
			currentRCHID = null;
			currentPmmvy = null;
			return;
		}

		const data = await response.json();
		if (!data) {
			bcRecordBox.innerHTML = "<p class='muted'>No record found.</p>";
			currentRCHID = null;
			currentPmmvy = null;
			return;
		}

		// Store current record
		currentRCHID = data.rchid;
		currentPmmvy = data.pmmvy ?? null;

		// Display table
		bcRecordBox.innerHTML = `
<table class="full-width-table">
<tr>
    <th>District</th><td>${data.district}</td>
    <th>Health Block</th><td>${data.healthBlock}</td>
    <th>Health Facility</th><td>${data.healthfacility}</td>
    <th>Sub Facility</th><td>${data.healthSubfacility}</td>
</tr>
<tr>
    <th>Village</th><td>${data.village}</td>
    <th>RCH ID</th><td>${data.rchid}</td>
    <th>Mother Name</th><td>${data.motherName}</td>
    <th>Father Name</th><td>${data.husbandName}</td>
</tr>
<tr>
    <th>Mobile Of</th><td>${data.mobileof}</td>
    <th>Mobile No</th><td>${data.mobileNo}</td>
    <th>Age (As per Reg.)</th><td>${data.ageAsPerRegistration}</td>
    <th>Mother Birth Date</th><td>${data.motherBirthDate}</td>
</tr>
<tr>
    <th>Address</th><td>${data.address}</td>
    <th>Anm Name</th><td>${data.anmname}</td>
    <th>Asha Name</th><td>${data.ashaname}</td>
    <th>Registration Date</th><td>${data.registrationDate}</td>
</tr>
<tr>
    <th>LMD</th><td>${data.lmd}</td>
    <th>EDD</th><td>${data.edd}</td>
    <th>PMMVY Beneficiary</th><td>${
			data.pmmvy === 1 ? "Yes" : data.pmmvy === 0 ? "No" : "Not Updated"
		}</td>
    <th>Remark</th><td>${data.remarkPmmvy ?? "Not Updated"}</td>
</tr>
</table>
        `;

		// Show current Pmmvy selection
		beneficiaryStatus.innerText =
			currentPmmvy === 1
				? "Current: Beneficiary"
				: currentPmmvy === 0
				? "Current: Non-beneficiary"
				: "Current: Not set";

		remarkInput.value = data.remarkPmmvy ?? "";
	} catch (err) {
		console.error(err);
		bcRecordBox.innerHTML = "<p class='muted'>Error fetching record.</p>";
		currentRCHID = null;
		currentPmmvy = null;
	}
}

// -----------------------------
// 3️⃣ RESET SEARCH
// -----------------------------
function resetSearchBC() {
	bcSearchInput.value = "";
	bcRecordBox.innerHTML = "No record fetched yet.";
	remarkInput.value = "";
	remarkMsg.textContent = "";
	beneficiaryStatus.textContent = "";
	currentRCHID = null;
	currentPmmvy = null;
}

// -----------------------------
// 4️⃣ SELECT MBY
// -----------------------------
function setBeneficiary(value) {
	if (!currentRCHID) {
		remarkMsg.textContent = "Fetch record first.";
		remarkMsg.style.color = "red";
		return;
	}

	currentPmmvy = value === "yes" ? 1 : 0;
	beneficiaryStatus.innerText =
		value === "yes" ? "Marked as Beneficiary" : "Marked as Non-beneficiary";
	remarkMsg.textContent = "";
}

// -----------------------------
// 5️⃣ SAVE Pmmvy & REMARK
// -----------------------------
async function savePMMVY() {
	const remark = remarkInput.value.trim();

	if (!currentRCHID) {
		remarkMsg.textContent = "Fetch record first.";
		remarkMsg.style.color = "red";
		return;
	}

	if (currentPmmvy === null) {
		remarkMsg.textContent = "Select Yes/No for PMMVY.";
		remarkMsg.style.color = "red";
		return;
	}

	if (!remark) {
		remarkMsg.textContent = "Enter a remark.";
		remarkMsg.style.color = "red";
		return;
	}

	try {
		const token = localStorage.getItem("jwtToken");
		const response = await fetch(`${apiBase}/update-pmmvy/${currentRCHID}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...(token && { Authorization: `Bearer ${token}` }),
			},
			body: JSON.stringify({ Pmmvy: currentPmmvy, remarkPmmvy: remark }),
		});

		const text = await response.text();
		let result;
		try {
			result = JSON.parse(text);
		} catch {
			result = { message: text || "No response from server" };
		}

		if (response.ok) {
			remarkMsg.textContent = result.message || "PMMVY updated successfully.";
			remarkMsg.style.color = "green";
			searchBC(); // refresh table
		} else {
			remarkMsg.textContent = result.message || "Update failed.";
			remarkMsg.style.color = "red";
		}
	} catch (err) {
		console.error(err);
		remarkMsg.textContent = "Error updating PMMVY: " + err.message;
		remarkMsg.style.color = "red";
	}
}

function logout() {
	localStorage.clear();
	window.location.href = "login.html";
}
