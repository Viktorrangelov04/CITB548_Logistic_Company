
async function login(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const accountType = document.querySelector(
        'input[name="accountType"]:checked'
    ).value;

    let apiUrl = "";
    if(accountType==="user"){
        apiUrl = "http://localhost:3000/auth/login";
    }else if(accountType ==="company"){
        apiUrl = "http://localhost:3000/auth/login-company"
    }else{
        document.getElementById("message").textContent=
        "Please select an account type.";
        document.getElementById("message").style.color="red";
        return;
    }

    try{
        const response = await fetch(apiUrl, {
            method: "POST",
            headers:{"Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: "include",
        })
        const json = await response.json();
        const messageElement = document.getElementById("message");

        if(!response.ok){
            messageElement.textContent = json.message || "Login failed";
            messageElement.style.color="red";
            console.error("Login error:", json);
            return;
        }
        messageElement.textContent = json.message || "Login successful!";
        messageElement.style.color = "green";

        if(accountType==="user"){
            window.location.href = "/frontend/public/home.html";
        }else if(accountType==="company"){
            window.location.href="/frontend/public/homeAdmin.html";
        }
        }catch(error){
            const messageElement = document.getElementById("message");
            messageElement.textContent="An unexpected error ocurred";
            messageElement.style.color="red";
            console.error("Frontend fetch error:", error);
        }
    
}

document.addEventListener('DOMContentLoaded', ()=>{
    const loginButton = document.getElementById("loginButton");
    if(loginButton){
        loginButton.addEventListener("click", login);
    }else{
        console.log("Login button isn't found")
    }
})