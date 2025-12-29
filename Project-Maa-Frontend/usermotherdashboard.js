// ================================
// MotherDashboard.js
// ================================

const apiUrl = "https://pehchanapi.rdmp.in/api/Motherschemerecord";

const tableContainer = document.getElementById("childrenList");
const searchInput = document.getElementById("searchInput");
const pageNumberEl = document.getElementById("pageNumber");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let motherData = [];
let filteredData = [];
let currentPage = 1;
const pageSize = 10;

// -------------------- Auth --------------------
function checkLogin() {
	const token = localStorage.getItem("jwtToken");
	if (!token) window.location.href = "login.html";
}

function logout() {
	localStorage.clear();
	window.location.href = "login.html";
}

// -------------------- Fetch All Mothers --------------------
async function fetchAllMothers() {
	try {
		const token = localStorage.getItem("jwtToken");
		const res = await fetch(`${apiUrl}/all`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		const data = await res.json();
		motherData = mapMotherData(data);
		filteredData = motherData;

		currentPage = 1;
		renderTable();
	} catch (err) {
		console.error(err);
		tableContainer.innerHTML = `<div class="muted">Error loading data</div>`;
	}
}

// -------------------- Render Table --------------------
function renderTable() {
	if (!filteredData.length) {
		tableContainer.innerHTML = `<div class="muted">No records found</div>`;
		pageNumberEl.textContent = "Page 0";
		document.getElementById("totalrecord").textContent = 0;
		return;
	}

	const start = (currentPage - 1) * pageSize;
	const pageData = filteredData.slice(start, start + pageSize);

	let html = `<table>
        <thead>
            <tr>
                <th>S.No</th>
                <th>District</th>
                <th>Block</th>
                <th>Health Facility</th>
                <th>Health Sub Facility</th>
                <th>Village</th>
                <th>RCH ID</th>
                <th>Mother Name</th>
                <th>Husband Name</th>
                <th>Mobile Of</th>
                <th>Mobile No</th>
                <th>Age</th>
                <th>Mother DOB</th>
                <th>Address</th>
                <th>ANM Name</th>
                <th>ASHA Name</th>
                <th>Registration Date</th>
                <th>LMP (LMD)</th>
                <th>EDD</th>
            </tr>
        </thead>
        <tbody>`;

	pageData.forEach((m, index) => {
		html += `<tr data-rchid="${m.rchid}">
            <td>${m.sno}<td>
            <td>${m.district}</td>
            <td>${m.healthBlock}</td>
            <td>${m.healthFacility}</td>
            <td>${m.healthSubFacility}</td>
            <td>${m.village}</td>
            <td>${m.rchid}</td>
            <td>${m.motherName}</td>
            <td>${m.husbandName}</td>
            <td>${m.mobileof}</td>
            <td>${m.mobileNo}</td>
            <td>${m.ageAsPerRegistration}</td>
            <td>${formatDate(m.motherBirthDate)}</td>
            <td>${m.address}</td>
            <td>${m.anmname}</td>
            <td>${m.ashaname}</td>
            <td>${formatDate(m.registrationDate)}</td>
            <td>${formatDate(m.lmd)}</td>
            <td>${formatDate(m.edd)}</td>
        </tr>`;
	});

	html += `</tbody></table>`;
	tableContainer.innerHTML = html;
	document.getElementById("totalrecord").textContent = filteredData.length;

	const totalPages = Math.ceil(filteredData.length / pageSize);
	pageNumberEl.textContent = `Page ${currentPage} of ${totalPages}`;
	prevBtn.disabled = currentPage === 1;
	nextBtn.disabled = currentPage === totalPages;
}

// -------------------- Pagination --------------------
prevBtn.onclick = () => {
	if (currentPage > 1) {
		currentPage--;
		renderTable();
	}
};
nextBtn.onclick = () => {
	if (currentPage < Math.ceil(filteredData.length / pageSize)) {
		currentPage++;
		renderTable();
	}
};

// -------------------- Search --------------------
function searchByRCHID() {
	const val = searchInput.value.trim();
	filteredData = val
		? motherData.filter((m) => m.rchid.toString() === val)
		: [...motherData];
	currentPage = 1;
	renderTable();
}

function resetSearch() {
	location.reload();
}

// -------------------- Village & Block Filter --------------------
const villageInput = document.getElementById("village");
const blockSelect = document.getElementById("block");

function filterByVillageAndBlock() {
	const v = villageInput.value.toLowerCase();
	const b = blockSelect.value.toLowerCase();

	filteredData = motherData.filter((m) => {
		const villageMatch = v ? m.village.toLowerCase().startsWith(v) : true;
		const blockMatch = b ? m.healthBlock.toLowerCase().includes(b) : true;
		return villageMatch && blockMatch;
	});

	currentPage = 1;
	renderTable();
}

villageInput.addEventListener("input", filterByVillageAndBlock);
blockSelect.addEventListener("change", filterByVillageAndBlock);

// -------------------- Scheme Dropdown (NOT UPDATED) --------------------
document.getElementById("certificate").addEventListener("change", async (e) => {
	const map = {
		mby: "GetAllWithoutMBY",
		jsy: "GetAllWithoutJSY",
		jssy: "GetAllWithoutJSSY",
		pmmvy: "GetAllWithoutPMMVY",
		mmjy: "GetAllWithoutMMJY",
	};

	if (!e.target.value) return fetchAllMothers();

	const token = localStorage.getItem("jwtToken");
	const res = await fetch(`${apiUrl}/${map[e.target.value]}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	filteredData = mapMotherData(await res.json());
	currentPage = 1;
	renderTable();
});

// -------------------- Count Functions --------------------
async function loadmby() {
	await loadCount("mby", "totalmby");
}
async function loadjsy() {
	await loadCount("jsy", "totaljs");
}
async function loadjssy() {
	await loadCount("jssy", "totaljss");
}
async function loadpmmvy() {
	await loadCount("pmmvy", "totalmv");
}
async function loadmmjy() {
	await loadCount("mmjy", "totalmm");
}

async function loadCount(scheme, elementId) {
	try {
		const response = await fetch(`${apiUrl}/${scheme}/yes/Count`, {
			method: "GET",
			headers: { Authorization: "Bearer " + localStorage.getItem("jwtToken") },
		});

		if (!response.ok) throw new Error("API failed");

		const data = await response.json(); // { count: 1 }
		document.getElementById(elementId).textContent = data.count ?? 0;
	} catch (error) {
		console.error(`Error loading ${scheme} count:`, error);
		document.getElementById(elementId).textContent = "0";
	}
}

// -------------------- Filter table on count click --------------------
async function filterByScheme(scheme) {
	try {
		const token = localStorage.getItem("jwtToken");
		const res = await fetch(`${apiUrl}/${scheme}/yes`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!res.ok) throw new Error("Failed to fetch filtered data");

		const data = await res.json();
		filteredData = mapMotherData(data);
		currentPage = 1;
		renderTable();
	} catch (err) {
		console.error(`Error fetching ${scheme} data:`, err);
		filteredData = [];
		renderTable();
	}
}

document
	.getElementById("totalmby")
	.addEventListener("click", () => filterByScheme("mby"));
document
	.getElementById("totaljs")
	.addEventListener("click", () => filterByScheme("jsy"));
document
	.getElementById("totaljss")
	.addEventListener("click", () => filterByScheme("jssy"));
document
	.getElementById("totalmv")
	.addEventListener("click", () => filterByScheme("pmmvy"));
document
	.getElementById("totalmm")
	.addEventListener("click", () => filterByScheme("mmjy"));

// -------------------- Total Count --------------------

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
		document.getElementById("TotalMother").textContent = count;
	} catch (error) {
		console.error("Error loading  count All:", error);
		document.getElementById("TotalMother").textContent = "0";
	}
}

// -------------------- Export CSV --------------------
function exportData() {
	const data = filteredData.length ? filteredData : motherData;
	if (!data.length) return alert("No data to export");

	const headers = Object.keys(data[0]).join(",");
	const rows = data.map((r) =>
		Object.values(r)
			.map((v) => `"${v ?? ""}"`)
			.join(",")
	);

	const csv = [headers, ...rows].join("\n");
	const blob = new Blob([csv], { type: "text/csv" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = "MotherDashboard.csv";
	link.click();
}

// -------------------- Map Data --------------------
function mapMotherData(data) {
	return data.map((m) => ({
		sno: m.sno ?? m.Sno ?? "",
		district: m.district ?? m.District ?? "",
		healthBlock: m.healthBlock ?? m.HealthBlock ?? "",
		healthFacility: m.healthFacility ?? m.HealthFacility ?? "",
		healthSubFacility: m.healthSubFacility ?? m.HealthSubFacility ?? "",
		village: m.village ?? m.Village ?? "",
		rchid: m.rchid ?? m.Rchid ?? "",
		motherName: m.motherName ?? m.MotherName ?? "",
		husbandName: m.husbandName ?? m.HusbandName ?? "",
		mobileof: m.mobileof ?? m.Mobileof ?? "",
		mobileNo: m.mobileNo ?? m.MobileNo ?? "",
		ageAsPerRegistration:
			m.ageAsPerRegistration ?? m.AgeAsPerRegistration ?? "",
		motherBirthDate: m.motherBirthDate ?? m.MotherBirthDate ?? "",
		address: m.address ?? m.Address ?? "",
		anmname: m.anmname ?? m.Anmname ?? "",
		ashaname: m.ashaname ?? m.Ashaname ?? "",
		registrationDate: m.registrationDate ?? m.RegistrationDate ?? "",
		lmd: m.lmd ?? m.Lmd ?? "",
		edd: m.edd ?? m.Edd ?? "",
	}));
}

// -------------------- Format Dates --------------------
function formatDate(dateStr) {
	if (!dateStr) return "";
	const d = new Date(dateStr);
	return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
}

// -------------------- delete  --------------------
async function deleteMother(rchid) {
	if (!confirm("Are you sure you want to delete this record?")) return;

	try {
		const token = localStorage.getItem("jwtToken");
		const res = await fetch(`${apiUrl}/delete/${rchid}`, {
			// <-- note /delete/
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || "Delete failed");
		}

		// Remove deleted record from motherData and filteredData
		motherData = motherData.filter((m) => m.rchid !== rchid);
		filteredData = filteredData.filter((m) => m.rchid !== rchid);

		renderTable();
		alert("Record deleted successfully");
	} catch (err) {
		console.error("Error deleting record:", err);
		alert("Failed to delete record: " + err.message);
	}
}
// -------------------- update date --------------------
function parseDateForApi(dateStr) {
	if (!dateStr) return null;
	const parts = dateStr.split("/");
	if (parts.length !== 3) return null;
	return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
		2,
		"0"
	)}`;
}
// -------------------- update  --------------------
async function updateMother(button) {
	const row = button.closest("tr");
	const rchid = row.dataset.rchid;
	const cells = row.querySelectorAll("td[contenteditable]");

	const model = {
		District: cells[0].textContent.trim(),
		HealthBlock: cells[1].textContent.trim(),
		HealthFacility: cells[2].textContent.trim(),
		HealthSubFacility: cells[3].textContent.trim(),
		Village: cells[4].textContent.trim(),
		MotherName: cells[5].textContent.trim(),
		HusbandName: cells[6].textContent.trim(),
		Mobileof: cells[7].textContent.trim(),
		MobileNo: cells[8].textContent.trim(),
		AgeAsPerRegistration: cells[9].textContent.trim(),
		MotherBirthDate: parseDateForApi(cells[10].textContent.trim()),
		Address: cells[11].textContent.trim(),
		ANMName: cells[12].textContent.trim(),
		ASHAName: cells[13].textContent.trim(),
		RegistrationDate: parseDateForApi(cells[14].textContent.trim()),
		LMD: parseDateForApi(cells[15].textContent.trim()),
		EDD: parseDateForApi(cells[16].textContent.trim()),
	};

	try {
		const token = localStorage.getItem("jwtToken");
		const res = await fetch(`${apiUrl}/update/${rchid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(model),
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || "Update failed");
		}

		alert(`✏️ Record with RCHID ${rchid} updated successfully.`);
	} catch (err) {
		console.error("Update error:", err);
		alert("Error updating record: " + err.message);
	}
}

// -------------------- Init --------------------
document.addEventListener("DOMContentLoaded", () => {
	checkLogin();
	fetchAllMothers();
	loadTotalCount();
	loadmby();
	loadjsy();
	loadjssy();
	loadpmmvy();
	loadmmjy();
});

// -------------------- Scheme Dropdown (NOT UPDATED / NULL) --------------------
async function applySchemeFilter(type, scheme) {
	if (!scheme) {
		await fetchAllMothers();
		return;
	}

	const apiMap = {
		Null: {
			mby: "mby/Null",
			jsy: "jsy/Null",
			jssy: "jssy/Null",
			pmmvy: "pmmvy/Null",
			mmjy: "mmjy/Null",
		},
		No: {
			mby: "mby/No",
			jsy: "jsy/No",
			jssy: "jssy/No",
			pmmvy: "pmmvy/No",
			mmjy: "mmjy/No",
		},
	};

	try {
		const token = localStorage.getItem("jwtToken");

		const res = await fetch(`${apiUrl}/${apiMap[type][scheme]}`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!res.ok) throw new Error("Failed to load scheme data");

		const data = await res.json();
		filteredData = mapMotherData(data);
		currentPage = 1;
		renderTable();
	} catch (err) {
		console.error("Scheme filter error:", err);
		filteredData = [];
		renderTable();
	}
}
// -----NOT UPDATED
document.getElementById("certificate").addEventListener("change", async (e) => {
	// reset NO dropdown
	document.getElementById("certificate1").value = "";

	await applySchemeFilter("Null", e.target.value);
});
// -----NOT GET
document
	.getElementById("certificate1")
	.addEventListener("change", async (e) => {
		// reset NULL dropdown
		document.getElementById("certificate").value = "";

		await applySchemeFilter("No", e.target.value);
	});
