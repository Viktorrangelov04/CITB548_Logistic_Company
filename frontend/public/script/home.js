// import fetchOrders from "fetchOrders.js";

async function displayUserName(){
    try{
        const response = await fetch("http://localhost:3000/auth/me", {
            method: "GET",
            headers:{
                "Content-Type": "application/json"
            },
            credentials: "include",
        });

        if(!response.ok){
            if(response.status=== 401 || response.status===403){
                window.location.href = "/frontend/public/login.html";
            }
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch user data");
        }

        const userData = await response.json();
        const userNameDisplay = document.getElementById("userNameDisplay");

        if(userNameDisplay){
            userNameDisplay.textContent = userData.name || "user"
        }
    }catch(error){
        console.error("Error fetching user data:", error);
        const userNameDisplay = document.getElementById("userNameDisplay");
        if(userNameDisplay){
            userNameDisplay.textContent = "Error";
        }
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    displayUserName();
    // fetchOrders();
})