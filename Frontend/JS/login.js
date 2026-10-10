// If already logged in, skip login page entirely
const existingUser = JSON.parse(localStorage.getItem("currentUser"));
if (existingUser) {
    window.location.href = "dashboard.html";
}
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:8081/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await res.text();

        if (result === "Login successful") {
            // Fetch the user's full details (to get their ID) so the dashboard can use it
            const usersRes = await fetch("http://localhost:8081/api/users");
            const users = await usersRes.json();
            const currentUser = users.find(u => u.email === email);

            // Save user info in the browser so other pages can access it
            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid email or password");
        }
    } catch (error) {
        alert("Could not connect to server. Make sure the backend is running.");
        console.error(error);
    }
});