async function createOffice(){
    const address = document.getElementById("address").value;

    try{
        const response = fetch("http://localhost:3000/office", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: address,
            }),
            credentials:"include",
        })

        if(!response.ok){
            if(response.status=== 401 || response.status===403){
                window.location.href = "/frontend/public/login.html";
                return null;
            }else if (response.status >= 500) {
                console.error("Server error:", response.status, response.statusText);
                try{
                    const errorData = await response.json();
                    console.error("Server error details:", errorData);
                }catch (e) {
                    console.error("Could not parse server error response (not JSON).");
                }
                return null;
            }else if (response.status >= 400) {
                console.error("Client error:", response.status, response.statusText);
                try {
                    const errorData = await response.json();
                    console.error("Client error details:", errorData);
                } catch (e) {
                    console.error("Could not parse client error response (not JSON).");
                }
                return null;
            }
        }    
        const messageElement = document.getElementById("message");
        messageElement.textContent="Office created successfully";
        messageElement.style.color="green";
    }catch(error){
        const messageElement = document.getElementById("message");
        messageElement.textContent="An unexpected error ocurred";
        messageElement.style.color="red";
        console.error("Frontend fetch error:", error);
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("createOfficeButton").addEventListener("click", createOffice);
})