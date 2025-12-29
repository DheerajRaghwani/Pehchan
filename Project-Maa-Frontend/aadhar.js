// ===============================
// Aadhaar Entry JS
// ===============================

const apiBase = "https://pehchanapi.rdmp.in/api/Childrecord";
let currentRCHID = null; // store RCH ID from fetched record

// ------------------------------------------
// 1️⃣ SEARCH BY BIRTH CERTIFICATE NUMBER
// ------------------------------------------
async function searchBC() {
	const bc = document.getElementById("bcSearchInput").value.trim();
	const box = document.getElementById("bcRecordBox");
	const msg = document.getElementById("aadharMsg");

	msg.textContent = "";
	box.innerHTML = "<p class='muted'>Searching...</p>";

	if (!bc) {
		box.innerHTML =
			"<p class='muted'>Please enter Birth Certificate Number.</p>";
		return;
	}

	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiBase}/GetByBirthCert/${bc}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			box.innerHTML = "<p class='muted'>No record found.</p>";
			return;
		}

		const data = await response.json();
		currentRCHID = data.rchid; // <-- store RCHID for update

		// ------ SHOW RECORD IN TABLE ------
		box.innerHTML = `
              <table class="full-width-table">
  <tr>
    <th>District</th><td>${data.district}</td>
    <th>Health Block</th><td>${data.healthBlock}</td>
    <th>Subfacility</th><td>${data.healthSubfacility}</td>
    <th>Village</th><td>${data.village}</td>
  </tr>

  <tr>
    <th>RCH ID</th><td>${data.rchid}</td>
    <th>Mother Name</th><td>${data.motherName}</td>
    <th>Father Name</th><td>${data.husbandName}</td>
    <th>Mobile Of</th><td>${data.mobileof}</td>
  </tr>

  <tr>
    <th>Mobile No</th><td>${data.mobileNo}</td>
    <th>Age (As per Reg.)</th><td>${data.ageasperRegistration}</td>
    <th>Address</th><td>${data.address}</td>
    <th>Delivery</th><td>${data.delivery}</td>
  </tr>

  <tr>
    <th>Maternal Death</th><td>${data.maternalDeath}</td>
    <th>Delivery Place</th><td>${data.deliveryPlace}</td>
    <th>Delivery Place Name</th><td>${data.deliveryPlaceName}</td>
    <th>Aadhaar</th><td>${data.aadhaarCardNumber ?? "Not Updated"}</td>
  </tr>

   
</table>
        `;
	} catch (err) {
		console.error(err);
		box.innerHTML = "<p class='muted'>Error fetching record.</p>";
	}
}

// ------------------------------------------
// 2️⃣ RESET SEARCH BOX
// ------------------------------------------
function resetSearchBC() {
	document.getElementById("bcSearchInput").value = "";
	document.getElementById("bcRecordBox").innerHTML = "No record fetched yet.";
	document.getElementById("aadharMsg").textContent = "";
	currentRCHID = null;
}

// ------------------------------------------
// 3️⃣ SAVE AADHAAR LAST 4 DIGITS
// ------------------------------------------
async function saveAadhar() {
	const digits = document.getElementById("aadharLast4").value.trim();
	const msg = document.getElementById("aadharMsg");

	msg.textContent = "";
	msg.style.color = "red";

	if (!currentRCHID) {
		msg.textContent = "Please search and fetch a record first.";
		return;
	}

	if (!digits || digits.length !== 4) {
		msg.textContent = "Enter valid last 4 digits.";
		return;
	}

	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiBase}/UpdateAadhaar/${currentRCHID}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ LastFourDigits: digits }),
		});

		const result = await response.text();
		console.log("Backend:", result);

		if (!response.ok) {
			msg.textContent = result;
			return;
		}

		msg.textContent = "✔ Aadhaar updated successfully!";
		msg.style.color = "green";
		document.getElementById("aadharLast4").value = "";
		// refresh UI
		setTimeout(() => {
			searchBC(); // reload data AFTER 1.5 seconds
		}, 1500);
	} catch (err) {
		console.error(err);
		msg.textContent = "Error updating Aadhaar.";
	}
}

// ------------------------------------------
// 4️⃣ LOGIN CHECK
// ------------------------------------------
function checkLogin() {
	const token = localStorage.getItem("jwtToken");
	if (!token) {
		alert("Session expired! Please login again.");
		window.location.href = "index.html";
	}
}

// ------------------------------------------
// 5️⃣ LOGOUT
// ------------------------------------------
// Logout
function logout() {
	localStorage.removeItem("jwtToken");
	localStorage.removeItem("user");
	window.location.href = "login.html";
}
