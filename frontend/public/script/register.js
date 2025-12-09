

async function register(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const accountType = document.querySelector(
        'input[name="accountType.checked"]'
    )

    let apiUrl = "";
    if(accountType==="user"){
        apiUrl = "http://localhost:3000/auth/register";
    }else if(accountType==="company"){
        apiUrl = "http://localhost:3000/auth/register-company"
    }else{
        document.getElementById("message").textContent="Please select a ccount type";
        document.getElementById("message").style.color="red";

    }
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
        credentials: "include",
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