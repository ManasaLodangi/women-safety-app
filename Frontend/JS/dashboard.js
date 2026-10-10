const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    alert("Please login first");
    window.location.href = "login.html";
}

document.getElementById("welcomeMsg").textContent = "Welcome, " + currentUser.name + "!";

let selectMode = false;
let selectedContacts = new Set();

// Load emergency contacts
async function loadContacts() {
    const res = await fetch(`https://women-safety-app-1-rqy8.onrender.com/api/contacts/user/${currentUser.id}`);
    const contacts = await res.json();

    const list = document.getElementById("contactsList");
    list.innerHTML = "";

    contacts.forEach(contact => {
        const li = document.createElement("li");
        li.className = "contact-item";

        if (selectMode) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = selectedContacts.has(contact.id);
            checkbox.onchange = function() {
                if (checkbox.checked) {
                    selectedContacts.add(contact.id);
                } else {
                    selectedContacts.delete(contact.id);
                }
                updateTrashState();
            };
            li.appendChild(checkbox);
        }

        const span = document.createElement("span");
        span.textContent = `${contact.contactName} (${contact.relationship}) - ${contact.contactPhone}`;
        span.onclick = function() {
            if (!selectMode) {
                selectMode = true;
                selectedContacts.add(contact.id);
                loadContacts();
            }
        };

        li.appendChild(span);
        list.appendChild(li);
    });

    updateTrashState();
}

function updateTrashState() {
    const trashBtn = document.getElementById("deleteSelectedBtn");
    trashBtn.classList.toggle("active", selectedContacts.size > 0);
}

// Trash icon click - delete all selected
document.getElementById("deleteSelectedBtn").addEventListener("click", async function() {
    if (selectedContacts.size === 0) return;

    for (const id of selectedContacts) {
        await fetch(`https://women-safety-app-1-rqy8.onrender.com/api/contacts/${id}`, { method: "DELETE" });
    }

    selectedContacts.clear();
    selectMode = false;
    loadContacts();
});

loadContacts();

// Add new contact
document.getElementById("contactForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const data = {
        userId: currentUser.id,
        contactName: document.getElementById("contactName").value,
        contactPhone: document.getElementById("contactPhone").value,
        relationship: document.getElementById("relationship").value
    };

    await fetch("https://women-safety-app-1-rqy8.onrender.com/api/contacts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    document.getElementById("contactForm").reset();
    loadContacts();
});

// SOS button
// SOS button
document.getElementById("sosBtn").addEventListener("click", function() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(async function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const data = {
            userId: currentUser.id,
            latitude: lat,
            longitude: lng
        };

        await fetch("https://women-safety-app-1-rqy8.onrender.com/api/sos/trigger", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const res = await fetch(`https://women-safety-app-1-rqy8.onrender.com/api/contacts/user/${currentUser.id}`);
        const contacts = await res.json();

        if (contacts.length === 0) {
            alert("No emergency contacts found. Please add contacts first.");
            return;
        }

        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
        const message = `🚨 EMERGENCY! I'm in danger. My current location: ${mapsLink}`;

        const buttonsContainer = document.getElementById("whatsappButtons");
        buttonsContainer.innerHTML = "";

        contacts.forEach(contact => {
            const phoneWithCode = "91" + contact.contactPhone;
            const whatsappUrl = `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`;

            const btn = document.createElement("button");
            btn.textContent = "Send to " + contact.contactName;
            btn.className = "whatsapp-send-btn";
            btn.onclick = function() {
                window.open(whatsappUrl, "_blank");
            };

            buttonsContainer.appendChild(btn);
        });

        document.getElementById("sosMessage").textContent =
            "Location captured! Tap each button below to send the alert.";
    }, function(error) {
        alert("Could not get your location. Please enable location access.");
    });
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", function() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
});