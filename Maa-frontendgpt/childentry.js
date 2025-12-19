// childentry.js

const apiUrl = "https://localhost:7003/api/Childrecord"; // Backend API URL

// Get JWT token
function getToken() {
    return localStorage.getItem("jwtToken") || "";
}

// Message display
function showMessage(msg, type = "success") {
    const msgBox = document.getElementById("childMsg");
    msgBox.textContent = msg;
    msgBox.style.color = type === "success" ? "green" : "red";
    setTimeout(() => { msgBox.textContent = ""; }, 4000);
}

// Escape HTML
function escapeHtml(s) {
    return (s || "").toString().replace(/[&<>"']/g, c =>
        ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
    );
}

// Save child record
async function saveChild() {
    const form = document.getElementById("childForm");
    const model = {
        District: escapeHtml(document.getElementById("District").value.trim())  ,
        HealthBlock: escapeHtml(document.getElementById("HealthBlock").value.trim())  ,
        HealthSubfacility: escapeHtml(document.getElementById("HealthSubFacility").value.trim())  ,
        Village: escapeHtml(document.getElementById("Village").value.trim())  ,
        Rchid: escapeHtml(document.getElementById("RCHID").value.trim()) ,
        MotherName: escapeHtml(document.getElementById("MotherName").value.trim())  ,
        HusbandName: escapeHtml(document.getElementById("HusbandName").value.trim()) ,
        Mobileof: escapeHtml(document.getElementById("Mobileof").value.trim())  ,
        MobileNo: escapeHtml(document.getElementById("MobileNo").value.trim())  ,
        AgeasperRegistration: escapeHtml(document.getElementById("AgeasperRegistration").value.trim()) ,
        Address: escapeHtml(document.getElementById("Address").value.trim())  ,
        Delivery: document.getElementById("Delivery").value ,
        MaternalDeath: document.getElementById("MaternalDeath").value ,
        DeliveryPlace: document.getElementById("DeliveryPlace").value,
        DeliveryPlaceName: escapeHtml(document.getElementById("DeliveryPlaceName").value.trim()) 
    };

    // Validate required fields
    const requiredFields = ["District", "HealthBlock", "HealthSubfacility", "Village", "Rchid", "MotherName"];
    for (const field of requiredFields) {
        if (!model[field]) {
            showMessage(`Please fill all required fields: ${field}`, "error");
            return;
        }
    }

    // Send POST request
    try {
        const response = await fetch(`${apiUrl}/Add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(model)
        });

        if (response.status === 401) {
            showMessage("Unauthorized! Please login again.", "error");
            setTimeout(() => window.location.href = "login.html", 1500);
            return;
        }

        if (response.ok) {
            const result = await response.text();
            showMessage(result, "Successfully Saved");
            form.reset();
        } else {
            let errorText;
            try {
                const errorJson = await response.json();
                errorText = errorJson.message || JSON.stringify(errorJson);
            } catch {
                errorText = await response.text();
            }
            showMessage(`Error: ${errorText}`, "error");
        }

    } catch (err) {
        console.error("Fetch error:", err);
        showMessage("Fetch failed. Check console for details.", "error");
    }
}

// Reset form manually
function resetChildForm() {
    document.getElementById("childForm").reset();
    document.getElementById("childMsg").textContent = "";
}

// Check login on page load
function checkLogin() {
    const token = getToken();
    if (!token) window.location.href = "login.html";
}

// Logout
function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// Initialize
document.addEventListener("DOMContentLoaded", checkLogin);
