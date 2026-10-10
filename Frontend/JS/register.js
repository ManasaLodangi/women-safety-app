document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value
    };

    try {
        const res = await fetch("http://localhost:8081/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("Registration successful! Please login.");
            window.location.href = "login.html";
        } else {
            alert("Registration failed. Please try again.");
        }
    } catch (error) {
        alert("Could not connect to server. Make sure the backend is running.");
        console.error(error);
    }
});