// ===============================
// Ayushman Card Entry JS
// ===============================

const apiBase = "https://localhost:7003/api/Childrecord";
let currentRCHID = null; // store RCHID for updating

// ------------------------------------------
// 1️⃣ SEARCH BY BIRTH CERTIFICATE + AADHAAR + RATION CARD
// ------------------------------------------
async function searchAyushman() {
    const bc = document.getElementById("bcSearchInput").value.trim();
    const aadhaarLast4 = document.getElementById("aadhaarLast4").value.trim();
    const rationNumber = document.getElementById("rationNumber").value.trim();
    const box = document.getElementById("ayushmanRecordBox");
    const msg = document.getElementById("ayushmanMsg");

    msg.textContent = "";
    box.innerHTML = "<p class='muted'>Searching...</p>";

    if (!bc || !aadhaarLast4 || !rationNumber) {
        box.innerHTML = "<p class='muted'>Please enter Birth Certificate, last 4 digits of Aadhaar, and Ration Card.</p>";
        return;
    }

    try {
        const token = localStorage.getItem("jwtToken");

        const response = await fetch(
            `${apiBase}/GetByBC_Aadhaar_Ration?birthCertificateId=${bc}&lastFourDigits=${aadhaarLast4}&rationCardNumber=${rationNumber}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            box.innerHTML = "<p class='muted'>No record found.</p>";
            return;
        }

        const data = await response.json();
        currentRCHID = data.rchid; // save RCHID for updating Ayushman Card

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
                    <th>Ayushman Card</th><td>${data.ayushmanCardNumber ?? "Not Updated"}</td>
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
function resetSearchAyushman() {
    document.getElementById("bcSearchInput").value = "";
    document.getElementById("aadhaarLast4").value = "";
    document.getElementById("rationNumber").value = "";
    document.getElementById("ayushmanRecordBox").innerHTML = "No record fetched yet.";
    document.getElementById("ayushmanMsg").textContent = "";
    currentRCHID = null;
}

// ------------------------------------------
// 3️⃣ SAVE AYUSHMAN CARD NUMBER
// ------------------------------------------
async function saveAyushman() {
    const ayushmanNumber = document.getElementById("ayushmanNumber").value.trim();
    const msg = document.getElementById("ayushmanMsg");

    msg.textContent = "";
    msg.style.color = "red";

    if (!currentRCHID) {
        msg.textContent = "Please search and fetch a record first.";
        return;
    }

    if (!ayushmanNumber) {
        msg.textContent = "Please enter Ayushman Card Number.";
        return;
    }

    try {
        const token = localStorage.getItem("jwtToken");

        const response = await fetch(
            `${apiBase}/UpdateAyushmanCard/${currentRCHID}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ AyushmanCardNumber: ayushmanNumber })
            }
        );

        const result = await response.text();
        console.log("Backend:", result);

        if (!response.ok) {
            msg.textContent = result || "Failed to update Ayushman Card.";
            return;
        }

        // ✅ Success message
        msg.textContent = "✔ Ayushman Card updated successfully!";
        msg.style.color = "green";

        // Clear input after success
        document.getElementById("ayushmanNumber").value = "";

        // Refresh UI to show updated value
        setTimeout(() => {
            searchAyushman(); // reload data AFTER 1.5 seconds
        }, 1500);

    } catch (err) {
        console.error(err);
        msg.textContent = "Error updating Ayushman Card.";
    }
}

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

// ------------------------------------------
// 5️⃣ LOGOUT
// ------------------------------------------
// Logout
function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
