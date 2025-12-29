// ================================
// Matritva Bhatta Yojana JS
// ================================

const apiBase = "https://localhost:7003/api/Motherschemerecord";

// DOM Elements
const bcSearchInput = document.getElementById("bcSearchInput");
const bcRecordBox = document.getElementById("bcRecordBox");
const remarkInput = document.getElementById("remark");
const remarkMsg = document.getElementById("remarkMsg");
const beneficiaryStatus = document.getElementById("beneficiaryStatus");

// Track current record
let currentRCHID = null;
let currentJssy = null;

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
                ...(token && { "Authorization": `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            bcRecordBox.innerHTML = "<p class='muted'>No record found.</p>";
            currentRCHID = null;
            currentJssy = null;
            return;
        }

        const data = await response.json();
        if (!data) {
            bcRecordBox.innerHTML = "<p class='muted'>No record found.</p>";
            currentRCHID = null;
            currentJssy = null;
            return;
        }

        // Store current record
        currentRCHID = data.rchid;
        currentJssy = data.jssy ?? null;

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
    <th>JSSY Beneficiary</th><td>${data.jssy === 1 ? "Yes" : data.jssy === 0 ? "No" : "Not Updated"}</td>
    <th>Remark</th><td>${data.remarkJssy ?? "Not Updated"}</td>
</tr>
</table>
        `;

        // Show current JSSY selection
        beneficiaryStatus.innerText = currentJssy === 1
            ? "Current: Beneficiary"
            : currentJssy === 0
                ? "Current: Non-beneficiary"
                : "Current: Not set";

        remarkInput.value = data.remarkJssy ?? "";

    } catch (err) {
        console.error(err);
        bcRecordBox.innerHTML = "<p class='muted'>Error fetching record.</p>";
        currentRCHID = null;
        currentJssy = null;
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
    currentJssy = null;
}

// -----------------------------
// 4️⃣ SELECT JSSY
// -----------------------------
function setBeneficiary(value) {
    if (!currentRCHID) {
        remarkMsg.textContent = "Fetch record first.";
        remarkMsg.style.color = "red";
        return;
    }

    currentJssy = value === "yes" ? 1 : 0;
    beneficiaryStatus.innerText = value === "yes"
        ? "Marked as Beneficiary"
        : "Marked as Non-beneficiary";
    remarkMsg.textContent = "";
}

// -----------------------------
// 5️⃣ SAVE JSSY & REMARK
// -----------------------------
async function saveJSSY() {
    const remark = remarkInput.value.trim();

    if (!currentRCHID) {
        remarkMsg.textContent = "Fetch record first.";
        remarkMsg.style.color = "red";
        return;
    }

    if (currentJssy === null) {
        remarkMsg.textContent = "Select Yes/No for JSSY.";
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
        const response = await fetch(`${apiBase}/update-jssy/${currentRCHID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            },
            body: JSON.stringify({ Jssy: currentJssy, remarkJssy: remark})
        });

        const text = await response.text();
        let result;
        try {
            result = JSON.parse(text);
        } catch {
            result = { message: text || "No response from server" };
        }

        if (response.ok) {
            remarkMsg.textContent = result.message || "JSSY updated successfully.";
            remarkMsg.style.color = "green";
            searchBC(); // refresh table
        } else {
            remarkMsg.textContent = result.message || "Update failed.";
            remarkMsg.style.color = "red";
        }

    } catch (err) {
        console.error(err);
        remarkMsg.textContent = "Error updating JSY: " + err.message;
        remarkMsg.style.color = "red";
    }
}
 

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
