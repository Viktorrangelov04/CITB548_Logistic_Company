

async function register(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;

    fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
            name: name,
        }),
    });
    
    console.log("register was successful");
}

document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', register);
    } else {
        console.error("Register button not found!");
    }
});