async function register() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const name = document.getElementById("name").value.trim();
  const accountType = document.querySelector(
    'input[name="accountType"]:checked',
  ).value;

  if (!email || !password || !name) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = "All fields are required!";
    messageElement.style.color = "red";
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/; // email regex to validate input
  if (!emailRegex.test(email)) {
    const messageElement = document.getElementById("message");
    messageElement.textContent =
      "Please enter a valid email! (example@example.com)";
    messageElement.style.color = "red";
    return;
  }

  let apiUrl = "";
  if (accountType === "user") {
    apiUrl = "http://localhost:3000/auth/register";
  } else if (accountType === "company") {
    apiUrl = "http://localhost:3000/auth/register-company";
  } else {
    document.getElementById("message").textContent =
      "Please select account type";
    document.getElementById("message").style.color = "red";
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
      }),
      credentials: "include",
    });

    const json = await response.json();
    console.log(json);
    const messageElement = document.getElementById("message");

    if (!response.ok) {
      messageElement.textContent = json.message || "Login failed";
      messageElement.style.color = "red";
      console.error("Login error:", json);
      return;
    }

    messageElement.textContent = json.message || "Login successful!";
    messageElement.style.color = "green";

    if (accountType === "user") {
      window.location.href = "/frontend/public/home.html";
    } else if (accountType === "company") {
      window.location.href = "/frontend/public/homeAdmin.html";
    }
  } catch (error) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = "An unexpected error ocurred";
    messageElement.style.color = "red";
    console.error("Frontend fetch error:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const registerButton = document.getElementById("registerButton");
  if (registerButton) {
    registerButton.addEventListener("click", register);
  } else {
    console.error("Register button not found!");
  }
});
