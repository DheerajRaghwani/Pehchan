const apiBase = "https://pehchanapi.rdmp.in/api/Childrecord";

// -------------------------------
// 1️⃣ SEARCH CHILD BY RCH ID
// -------------------------------
async function searchRCH() {
	const rchid = document.getElementById("rchSearchInput").value.trim();
	const box = document.getElementById("rchRecordBox");
	const msg = document.getElementById("birthMsg");

	msg.textContent = "";
	box.innerHTML = "<p class='muted'>Searching...</p>";

	if (!rchid) {
		box.innerHTML = "<p class='muted'>Please enter RCH ID.</p>";
		return;
	}
	try {
		const token = localStorage.getItem("jwtToken");

		console.log("Fetching:", `${apiBase}/GetByRCHID/${rchid}`);

		const response = await fetch(`${apiBase}/GetByRCHID/${rchid}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			box.innerHTML = "<p class='muted'>No record found.</p>";
			return;
		}

		const data = await response.json();

		if (!data) {
			box.innerHTML = "<p class='muted'>No record found.</p>";
			return;
		}

		window.currentRCHID = data.rchid;

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
	<th>Birth Certificate</th><td>${data.birthCertificateId ?? "Not Updated"}</td>
  </tr>

   
</table>

        `;
	} catch (err) {
		console.error(err);
		box.innerHTML = "<p class='muted'>Error while fetching record.</p>";
	}
}

// ----------------------------
// 2️⃣ RESET
// ----------------------------
function resetSearchRCH() {
	document.getElementById("rchSearchInput").value = "";
	document.getElementById("rchRecordBox").innerHTML = "No record fetched yet.";
	document.getElementById("birthMsg").textContent = "";
	window.currentRCHID = null;
}

// ----------------------------
// 3️⃣ SAVE BC NUMBER
// ----------------------------
async function saveBirthCertificate() {
	const bcNumber = document.getElementById("bcNumber").value.trim();
	const msg = document.getElementById("birthMsg");

	msg.textContent = "";
	msg.style.color = "red";

	if (!window.currentRCHID) {
		msg.textContent = "Please search and fetch a record first.";
		return;
	}

	if (!bcNumber) {
		msg.textContent = "Please enter Birth Certificate Number.";
		return;
	}

	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(
			`${apiBase}/UpdateBirthCert/${window.currentRCHID}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(bcNumber),
			}
		);

		const result = await response.text();
		console.log("Backend Response:", result);

		if (!response.ok) {
			msg.textContent = result || "Failed to update birth certificate.";
			return;
		}

		// ✔ Show success message
		msg.textContent = "✔ Birth Certificate updated successfully!";
		msg.style.color = "green";
		document.getElementById("bcNumber").value = "";
		// ❗ Delay refresh so user can see message
		setTimeout(() => {
			searchRCH(); // reload data AFTER 1.5 seconds
		}, 1500);
	} catch (err) {
		console.error(err);
		msg.textContent = "Error while saving birth certificate.";
	}
}

// ----------------------------
// 4️⃣ CHECK LOGIN
// ----------------------------
function checkLogin() {
	const token = localStorage.getItem("jwtToken");
	if (!token) {
		alert("Session expired! Please login again.");
		window.location.href = "login.html";
	}
}

// ----------------------------
// 5️⃣ LOGOUT
// ----------------------------
// Logout
function logout() {
	localStorage.removeItem("jwtToken");
	localStorage.removeItem("user");
	window.location.href = "login.html";
}
