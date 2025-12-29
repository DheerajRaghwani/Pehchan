// Admindashboard.js

const apiUrl = "https://pehchanapi.rdmp.in/api/Childrecord"; // Backend API URL

// DOM elements
const childrenList = document.getElementById("childrenList");
const totalChildrenEl = document.getElementById("totalChildren");
const searchInput = document.getElementById("searchInput");
const pageNumberEl = document.getElementById("pageNumber");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let childrenData = [];
let filteredData = [];
let currentPage = 1;
const pageSize = 10;

// -------------------- Check login --------------------
function checkLogin() {
	const token = localStorage.getItem("jwtToken");
	if (!token) window.location.href = "login.html";
}

// -------------------- Logout --------------------
function logout() {
	localStorage.removeItem("jwtToken");
	localStorage.removeItem("user");
	window.location.href = "login.html";
}

// -------------------- Fetch all children --------------------
async function fetchAllChildren() {
	const token = localStorage.getItem("jwtToken");
	if (!token) {
		console.error("No JWT token found. Redirecting to login.");
		window.location.href = "login.html";
		return;
	}

	try {
		console.log("Fetching data from:", `${apiUrl}/GetAll`);
		const response = await fetch(`${apiUrl}/GetAll`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		console.log("Response status:", response.status);

		if (!response.ok) {
			if (response.status === 401)
				throw new Error("Unauthorized. Please login again.");
			if (response.status === 403)
				throw new Error("Forbidden. You don't have access.");
			throw new Error(`Server error: ${response.status}`);
		}

		const data = await response.json();
		console.log("Received data:", data);

		// If backend returns { data: [...] } structure
		const records = Array.isArray(data) ? data : data.data || [];
		childrenData = mapChildrenData(data);

		filteredData = childrenData;
		totalChildrenEl.textContent = childrenData.length;
		currentPage = 1;
		renderChildren();
	} catch (err) {
		console.error("Fetch error:", err);
		childrenList.innerHTML = `<div class="muted">Error loading data: ${err.message}</div>`;
		totalChildrenEl.textContent = 0;
	}
}

// -------------------- Render children table --------------------
function renderChildren() {
	if (!Array.isArray(filteredData) || filteredData.length === 0) {
		childrenList.innerHTML = `<div class="muted">No children found.</div>`;
		pageNumberEl.textContent = "Page 0 of 0";
		prevBtn.disabled = true;
		nextBtn.disabled = true;
		document.getElementById("totalrecord").textContent = 0; // update count
		return;
	}

	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize;
	const pageData = filteredData.slice(start, end);

	let html = `<table>
        <thead>
            <tr>
                <th>Sno</th>
                <th>District</th>
                <th>Health Block</th>
                <th>Health Subfacility</th>
                <th>Village</th>
                <th>RCH ID</th>
                <th>Mother Name</th>
                <th>Husband Name</th>
                <th>Mobile of</th>
                <th>Mobile No</th>
                <th>Age</th>
                <th>Address</th>
                <th>Delivery</th>
                <th>Maternal Death</th>
                <th>Delivery Place</th>
                <th>Delivery Place Name</th>
            </tr>
        </thead>
        <tbody>`;

	pageData.forEach((c) => {
		html += `<tr>
            <td>${c.sno}</td>
            <td>${c.district}</td>
            <td>${c.healthBlock}</td>
            <td>${c.healthSubfacility}</td>
            <td>${c.village}</td>
            <td>${c.rchid}</td>
            <td>${c.motherName}</td>
            <td>${c.husbandName}</td>
            <td>${c.mobileof}</td>
            <td>${c.mobileNo}</td>
            <td>${c.ageasperRegistration}</td>
            <td>${c.address}</td>
            <td>${c.delivery}</td>
            <td>${c.maternalDeath}</td>
            <td>${c.deliveryPlace}</td>
            <td>${c.deliveryPlaceName}</td>
        </tr>`;
	});

	html += `</tbody></table>`;
	childrenList.innerHTML = html;

	document.getElementById("totalrecord").textContent = filteredData.length;
	const totalPages = Math.ceil(filteredData.length / pageSize);
	pageNumberEl.textContent = `Page ${currentPage} of ${totalPages}`;
	prevBtn.disabled = currentPage === 1;
	nextBtn.disabled = currentPage === totalPages;
}

// -------------------- Pagination --------------------
function prevPage() {
	if (currentPage > 1) {
		currentPage--;
		renderChildren();
	}
}
function nextPage() {
	const totalPages = Math.ceil(filteredData.length / pageSize);
	if (currentPage < totalPages) {
		currentPage++;
		renderChildren();
	}
}

// -------------------- Search --------------------
function searchByRCHID() {
	const rchid = searchInput.value.trim();
	if (!rchid) {
		filteredData = [...childrenData];
	} else {
		filteredData = childrenData.filter((c) => c.rchid?.toString() === rchid);
	}
	currentPage = 1;
	renderChildren();
}
function resetSearch() {
	// Reload the page
	location.reload();
}

// -------------------- Utility to map API response --------------------
function mapChildrenData(data) {
	return data.map((c) => ({
		sno: c.sno ?? c.Sno ?? "—",
		district: c.district ?? c.District ?? "",
		healthBlock: c.healthBlock ?? c.HealthBlock ?? "",
		healthSubfacility: c.healthSubfacility ?? c.HealthSubfacility ?? "",
		village: c.village ?? c.Village ?? "",
		rchid: c.rchid ?? c.Rchid ?? "",
		motherName: c.motherName ?? c.MotherName ?? "",
		husbandName: c.husbandName ?? c.HusbandName ?? "",
		mobileof: c.mobileof ?? c.MobileOf ?? "",
		mobileNo: c.mobileNo ?? c.MobileNo ?? "",
		ageasperRegistration:
			c.ageasperRegistration ?? c.AgeAsPerRegistration ?? "",
		address: c.address ?? c.Address ?? "",
		delivery: c.delivery ?? c.Delivery ?? "",
		maternalDeath: c.maternalDeath ?? c.MaternalDeath ?? "",
		deliveryPlace: c.deliveryPlace ?? c.DeliveryPlace ?? "",
		deliveryPlaceName: c.deliveryPlaceName ?? c.DeliveryPlaceName ?? "",
	}));
}

// -------------------- Load filtered table --------------------
async function loadFilteredTable(endpoint) {
	try {
		const token = localStorage.getItem("jwtToken");
		const response = await fetch(`${apiUrl}/${endpoint}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!response.ok) throw new Error("Failed to load data");

		const data = await response.json();
		filteredData = mapChildrenData(data);
		currentPage = 1; // Reset page when filter changes
		renderChildren();
	} catch (error) {
		console.error(`Error loading ${endpoint} table:`, error);
		childrenList.innerHTML = `<div class="muted">Error fetching records.</div>`;
	}
}

// -------------------- Initialize --------------------
document.addEventListener("DOMContentLoaded", () => {
	checkLogin();
	fetchAllChildren();
	prevBtn.addEventListener("click", prevPage);
	nextBtn.addEventListener("click", nextPage);
	document
		.getElementById("totalbirth")
		.addEventListener("click", loadBirthCertificateTable);
	document
		.getElementById("totalcaste")
		.addEventListener("click", loadCasteCertificateTable);
	document
		.getElementById("totalration")
		.addEventListener("click", loadRationCardTable);
	document
		.getElementById("totalaadhar")
		.addEventListener("click", loadAadharCardTable);
	document
		.getElementById("totalayushman")
		.addEventListener("click", loadAyushmanCardTable);
});

// COUNT – Birth Certificate Entered
async function loadBirthCertificateCount() {
	try {
		const response = await fetch(`${apiUrl}/CountBirthCertificateEntered`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		});

		console.log("API Response Status:", response.status);
		console.log("Raw Response:", await response.clone().text());

		if (!response.ok) throw new Error();

		const count = await response.json();
		document.getElementById("totalbirth").textContent = count;
	} catch (error) {
		console.error("Error loading birth certificate count:", error);
		document.getElementById("totalbirth").textContent = "0";
	}
}

// COUNT – Caste Certificate Entered
async function loadCasteCertificateCount() {
	try {
		const response = await fetch(`${apiUrl}/CountCasteCertificateEntered`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		});

		console.log("API Response Status:", response.status);
		console.log("Raw Response:", await response.clone().text());

		if (!response.ok) throw new Error();

		const count = await response.json();
		document.getElementById("totalcaste").textContent = count;
	} catch (error) {
		console.error("Error loading Caste certificate count:", error);
		document.getElementById("totalcaste").textContent = "0";
	}
}

// COUNT – Ration Card Entered
async function loadRationCardCount() {
	try {
		const response = await fetch(`${apiUrl}/CountRationCardEntered`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		});

		console.log("API Response Status:", response.status);
		console.log("Raw Response:", await response.clone().text());

		if (!response.ok) throw new Error();

		const count = await response.json();
		document.getElementById("totalration").textContent = count;
	} catch (error) {
		console.error("Error loading Ration Card count:", error);
		document.getElementById("totalration").textContent = "0";
	}
}

// COUNT – Aadhar  Card Entered
async function loadAadharCardCount() {
	try {
		const response = await fetch(`${apiUrl}/CountAadharCardEntered`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		});

		console.log("API Response Status:", response.status);
		console.log("Raw Response:", await response.clone().text());

		if (!response.ok) throw new Error();

		const count = await response.json();
		document.getElementById("totalaadhar").textContent = count;
	} catch (error) {
		console.error("Error loading Aadhar Card count:", error);
		document.getElementById("totalaadhar").textContent = "0";
	}
}

// COUNT – Ayushman  Card Entered
async function loadAyushmanCardCount() {
	try {
		const response = await fetch(`${apiUrl}/CountAyushmanCardEntered`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		});

		console.log("API Response Status:", response.status);
		console.log("Raw Response:", await response.clone().text());

		if (!response.ok) throw new Error();

		const count = await response.json();
		document.getElementById("totalayushman").textContent = count;
	} catch (error) {
		console.error("Error loading Ayushman Card count:", error);
		document.getElementById("totalayushman").textContent = "0";
	}
}

// COUNT – ALL
async function loadTotalCount() {
	try {
		const response = await fetch(`${apiUrl}/CountAll`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		});

		console.log("API Response Status:", response.status);
		console.log("Raw Response:", await response.clone().text());

		if (!response.ok) throw new Error();

		const count = await response.json();
		document.getElementById("totalChildren").textContent = count;
	} catch (error) {
		console.error("Error loading  count All:", error);
		document.getElementById("totalChildren").textContent = "0";
	}
}

// Call this when page loads
window.onload = function () {
	loadBirthCertificateCount();
	loadCasteCertificateCount();
	loadRationCardCount();
	loadAadharCardCount();
	loadAyushmanCardCount();
	loadTotalCount();
};
// fetch Birth certificate
async function loadBirthCertificateTable() {
	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiUrl}/GetAllWithBirthCertificate`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Failed to load data");

		const data = await response.json();

		// Re-map like your main fetchAllChildren() does
		childrenData = mapChildrenData(data);

		filteredData = childrenData;
		currentPage = 1;
		renderChildren(); // re-use same table renderer
	} catch (error) {
		console.error("Error loading Birth Certificate table:", error);
		childrenList.innerHTML = `<div class="muted">Error fetching Birth Certificate records.</div>`;
	}
}

// fetch caste certificate
async function loadCasteCertificateTable() {
	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiUrl}/GetAllWithCasteCertificate`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Failed to load data");

		const data = await response.json();

		// Re-map like your main fetchAllChildren() does
		childrenData = mapChildrenData(data);

		filteredData = childrenData;
		currentPage = 1;
		renderChildren(); // re-use same table renderer
	} catch (error) {
		console.error("Error loading Birth Certificate table:", error);
		childrenList.innerHTML = `<div class="muted">Error fetching Birth Certificate records.</div>`;
	}
}

// fetch Aadhar card
async function loadAadharCardTable() {
	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiUrl}/GetAllWithAadharCard`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Failed to load data");

		const data = await response.json();

		// Re-map like your main fetchAllChildren() does
		childrenData = mapChildrenData(data);

		filteredData = childrenData;
		currentPage = 1;
		renderChildren(); // re-use same table renderer
	} catch (error) {
		console.error("Error loading Birth Certificate table:", error);
		childrenList.innerHTML = `<div class="muted">Error fetching Birth Certificate records.</div>`;
	}
}

// fetch ration card
async function loadRationCardTable() {
	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiUrl}/GetAllWithRationCard`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Failed to load data");

		const data = await response.json();

		// Re-map like your main fetchAllChildren() does
		childrenData = mapChildrenData(data);

		filteredData = childrenData;
		currentPage = 1;
		renderChildren(); // re-use same table renderer
	} catch (error) {
		console.error("Error loading Birth Certificate table:", error);
		childrenList.innerHTML = `<div class="muted">Error fetching Birth Certificate records.</div>`;
	}
}

// fetch ayushman card
async function loadAyushmanCardTable() {
	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiUrl}/GetAllWithAyushmanCard`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Failed to load data");

		const data = await response.json();

		// Re-map like your main fetchAllChildren() does
		childrenData = mapChildrenData(data);

		filteredData = childrenData;
		filteredData = [...childrenData];
		currentPage = 1;
		renderChildren(); // re-use same table renderer
	} catch (error) {
		console.error("Error loading Birth Certificate table:", error);
		childrenList.innerHTML = `<div class="muted">Error fetching Birth Certificate records.</div>`;
	}
}

// -------------------- Filter by Village & Block --------------------
const villageInput = document.getElementById("village");
const blockSelect = document.getElementById("block");

function filterByVillageAndBlock() {
	const selectedVillage = villageInput.value.trim().toLowerCase();
	const selectedBlock = blockSelect.value.trim().toLowerCase();

	filteredData = childrenData.filter((c) => {
		const village = (c.village ?? "").toLowerCase();
		const block = (c.healthBlock ?? "").toLowerCase();

		const villageMatch = selectedVillage
			? village.startsWith(selectedVillage) // alphabetical filtering
			: true;

		const blockMatch = selectedBlock ? block.includes(selectedBlock) : true;

		return villageMatch && blockMatch;
	});

	currentPage = 1;
	renderChildren();
}

// 🔥 Live typing filter
villageInput.addEventListener("input", filterByVillageAndBlock);

// Dropdown filter
blockSelect.addEventListener("change", filterByVillageAndBlock);

// -------------------- Certificate Dropdown --------------------
const certificateDropdown = document.getElementById("certificate");

certificateDropdown.addEventListener("change", async function () {
	const selected = this.value; // Get selected certificate

	// Map selection to corresponding API function
	switch (selected) {
		case "Birth":
			await loadWithoutBirthCertificateTable();
			break;
		case "Caste":
			await loadWithoutCasteCertificateTable();
			break;
		case "Aadhar":
			await loadWithoutAadharCardTable();
			break;
		case "Ayushman":
			await loadWithoutAyushmanCardTable();
			break;
		case "Ration":
			await loadWithoutRationCardTable();
			break;
		default:
			// If "Select Certificate" is chosen, reload all children
			await fetchAllChildren();
			break;
	}
});

// fetch without Birth certificate
async function loadWithoutBirthCertificateTable() {
	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiUrl}/GetAllWithoutBirthCertificate`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Failed to load data");

		const data = await response.json();

		// Re-map like your main fetchAllChildren() does
		childrenData = mapChildrenData(data);

		filteredData = childrenData;
		currentPage = 1;
		renderChildren(); // re-use same table renderer
	} catch (error) {
		console.error("Error loading Birth Certificate table:", error);
		childrenList.innerHTML = `<div class="muted">Error fetching Birth Certificate records.</div>`;
	}
}

// fetch Without caste certificate
async function loadWithoutCasteCertificateTable() {
	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiUrl}/GetAllWithoutCasteCertificate`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Failed to load data");

		const data = await response.json();

		// Re-map like your main fetchAllChildren() does
		childrenData = mapChildrenData(data);

		filteredData = childrenData;
		currentPage = 1;
		renderChildren(); // re-use same table renderer
	} catch (error) {
		console.error("Error loading Birth Certificate table:", error);
		childrenList.innerHTML = `<div class="muted">Error fetching Birth Certificate records.</div>`;
	}
}

// fetch Without Aadhar card
async function loadWithoutAadharCardTable() {
	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiUrl}/GetAllWithoutAadharCard`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Failed to load data");

		const data = await response.json();

		// Re-map like your main fetchAllChildren() does
		childrenData = mapChildrenData(data);

		filteredData = childrenData;
		currentPage = 1;
		renderChildren(); // re-use same table renderer
	} catch (error) {
		console.error("Error loading Birth Certificate table:", error);
		childrenList.innerHTML = `<div class="muted">Error fetching Birth Certificate records.</div>`;
	}
}

// fetch ration card
async function loadWithoutRationCardTable() {
	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiUrl}/GetAllWithoutRationCard`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Failed to load data");

		const data = await response.json();

		// Re-map like your main fetchAllChildren() does
		childrenData = mapChildrenData(data);

		filteredData = childrenData;
		currentPage = 1;
		renderChildren(); // re-use same table renderer
	} catch (error) {
		console.error("Error loading Birth Certificate table:", error);
		childrenList.innerHTML = `<div class="muted">Error fetching Birth Certificate records.</div>`;
	}
}

// fetch Withoutayushman card
async function loadWithoutAyushmanCardTable() {
	try {
		const token = localStorage.getItem("jwtToken");

		const response = await fetch(`${apiUrl}/GetAllWithoutAyushmanCard`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Failed to load data");

		const data = await response.json();

		// Re-map like your main fetchAllChildren() does
		childrenData = mapChildrenData(data);

		filteredData = childrenData;
		currentPage = 1;
		renderChildren(); // re-use same table renderer
	} catch (error) {
		console.error("Error loading Birth Certificate table:", error);
		childrenList.innerHTML = `<div class="muted">Error fetching Birth Certificate records.</div>`;
	}
}
// ===================== EXPORT TO CSV =====================
function exportData() {
	// Export filtered data if available, otherwise all data
	const dataToExport = filteredData.length ? filteredData : childrenData;

	if (!dataToExport || dataToExport.length === 0) {
		alert("No data available to export.");
		return;
	}

	// Define column headers & mapping
	const columns = [
		{ header: "S.No", key: "sno" },
		{ header: "District", key: "district" },
		{ header: "Health Block", key: "healthBlock" },
		{ header: "Health Sub Facility", key: "healthSubfacility" },
		{ header: "Village", key: "village" },
		{ header: "RCH ID", key: "rchid" },
		{ header: "Mother Name", key: "motherName" },
		{ header: "Husband Name", key: "husbandName" },
		{ header: "Mobile Of", key: "mobileof" },
		{ header: "Mobile No", key: "mobileNo" },
		{ header: "Age (Registration)", key: "ageasperRegistration" },
		{ header: "Address", key: "address" },
		{ header: "Delivery", key: "delivery" },
		{ header: "Maternal Death", key: "maternalDeath" },
		{ header: "Delivery Place", key: "deliveryPlace" },
		{ header: "Delivery Place Name", key: "deliveryPlaceName" },
	];

	// Create CSV content
	let csvContent = "";

	// Header row
	csvContent += columns.map((col) => `"${col.header}"`).join(",") + "\n";

	// Data rows
	dataToExport.forEach((row) => {
		const rowData = columns
			.map((col) => {
				let value = row[col.key] ?? "";
				value = value.toString().replace(/"/g, '""'); // escape quotes
				return `"${value}"`;
			})
			.join(",");
		csvContent += rowData + "\n";
	});

	// Create file & trigger download
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = `ProjectMaa_Children_${new Date()
		.toISOString()
		.slice(0, 10)}.csv`;
	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
