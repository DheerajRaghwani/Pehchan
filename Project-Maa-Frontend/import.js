// ---------------------------
// SETTINGS
// ---------------------------
const importApiUrl = "https://pehchanapi.rdmp.in/api/Childrecord/ImportExcel";
// Change URL if needed

// ------------------------------------
// Check Login before accessing page
// ------------------------------------
function checkLogin() {
	const token = localStorage.getItem("jwtToken");
	if (!token) {
		alert("Please login first.");
		window.location.href = "login.html";
	}
}

// ---------------------------
// Logout
// ---------------------------
function logout() {
	localStorage.clear();
	window.location.href = "login.html";
}

// ---------------------------
// Upload Excel File
// ---------------------------
async function uploadFile() {
	const fileInput = document.getElementById("importFile");
	const msg = document.getElementById("importMsg");

	msg.textContent = "";
	msg.style.color = "black";

	if (!fileInput.files.length) {
		msg.textContent = "Please choose an Excel file.";
		msg.style.color = "red";
		return;
	}

	const file = fileInput.files[0];
	const formData = new FormData();
	formData.append("file", file);

	try {
		msg.textContent = "Uploading... Please wait.";

		const response = await fetch(importApiUrl, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
			body: formData,
		});

		const result = await response.text();

		if (!response.ok) {
			msg.textContent = "Failed: " + result;
			msg.style.color = "red";
			return;
		}

		msg.textContent = "File uploaded successfully!";
		msg.style.color = "green";

		// Clear preview after successful upload
		resetPreview();
	} catch (err) {
		msg.textContent = "Error: " + err.message;
		msg.style.color = "red";
	}
}

// ---------------------------
// Preview Excel File
// ---------------------------
function previewExcelFile() {
	const fileInput = document.getElementById("importFile");
	if (fileInput.files.length === 0) {
		const msg = document.getElementById("importMsg");
		msg.textContent = "Please select a file first!";
		msg.style.color = "red";
		return;
	}
	previewExcel(fileInput.files[0]);
}

function previewExcel(file) {
	const msg = document.getElementById("importMsg");

	const reader = new FileReader();

	reader.onload = function (e) {
		const data = new Uint8Array(e.target.result);
		const workbook = XLSX.read(data, { type: "array" });

		const firstSheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[firstSheetName];

		const jsonData = XLSX.utils.sheet_to_json(worksheet, {
			header: 1,
			defval: "",
		});

		if (jsonData.length === 0) {
			msg.textContent = "Excel is empty!";
			msg.style.color = "red";
			return;
		}

		const table = document.getElementById("excelPreview");
		const thead = document.getElementById("previewHead");
		const tbody = document.getElementById("previewBody");

		thead.innerHTML = "";
		tbody.innerHTML = "";

		// Header row
		const headerRow = document.createElement("tr");
		jsonData[0].forEach((cell) => {
			const th = document.createElement("th");
			th.textContent = cell;
			headerRow.appendChild(th);
		});
		thead.appendChild(headerRow);

		// Data rows
		for (let i = 1; i < jsonData.length; i++) {
			const row = document.createElement("tr");
			jsonData[i].forEach((cell) => {
				const td = document.createElement("td");
				td.textContent = cell;
				row.appendChild(td);
			});
			tbody.appendChild(row);
		}

		table.style.display = "table";
		msg.textContent = "Preview loaded. Check below table.";
		msg.style.color = "green";

		// Scroll to table
		table.scrollIntoView({ behavior: "smooth" });
	};

	reader.onerror = function (err) {
		msg.textContent = "Error reading file: " + err;
		msg.style.color = "red";
	};

	reader.readAsArrayBuffer(file);
}

// ---------------------------
// Reset Import Form
// ---------------------------
function resetImport() {
	document.getElementById("importForm").reset();
	document.getElementById("importMsg").textContent = "";
	resetPreview();
}

function resetPreview() {
	const table = document.getElementById("excelPreview");
	const thead = document.getElementById("previewHead");
	const tbody = document.getElementById("previewBody");

	if (table) table.style.display = "none";
	if (thead) thead.innerHTML = "";
	if (tbody) tbody.innerHTML = "";
}
