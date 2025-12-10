let currentUserRole = null;

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
                return null;
            }
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch user data");
        }

        const userData = await response.json();
        const userNameDisplay = document.getElementById("userNameDisplay");

        currentUserRole = userData.role;

        if(userNameDisplay){
            userNameDisplay.textContent = userData.name || "user"
        }
        return userData;
    }catch(error){
        console.error("Error fetching user data:", error);
        const userNameDisplay = document.getElementById("userNameDisplay");
        if(userNameDisplay){
            userNameDisplay.textContent = "Error";
        }
        return null;
    }
}


const typeFiltersContainer = document.getElementById('type-filters');
const statusFiltersContainer = document.getElementById('status-filters');
const orderList = document.getElementById('order-list');
const applyFiltersButton = document.getElementById('applyFiltersBtn');

let currentTypeFilter='all';
let currentStatusFilter='all';

async function fetchOrders(){
    
    let url = 'http://localhost:3000/orders?';
    const params = [];
    if(currentStatusFilter !== 'all'){
        params.push(`status=${currentStatusFilter}`);
    }

    if(currentUserRole ==='client' && currentTypeFilter !=='all'){
        params.push(`type=${currentTypeFilter}`);
    }

    url+=params.join('&');

    try{
        orderList.innerHTML= 'Loading orders...';
        const response = await fetch(url, {
            method: "GET",
            headers:{
                "Content-Type":"application/json"
            },
            credentials: "include",
        });
        if(!response.ok){
            throw new Error(`Error: ${response.status}`);
        }

        const orders = await response.json();

        if(orders.length === 0){
            orderList.innerHTML='<p>No orders found matching your criteria.</p>';
            return;
        }

        orderList.innerHTML = orders.map(order=>`
            <div class="order-item">
                <div class="order-icon">
                    <img src="boxImage.png" alt="Order Box" class="order-box-image">
                </div>
                <div class="order-details">
                    <p><strong>From:</strong> ${order.sender.name} (${order.sender.email})</p>
                    <p><strong>To:</strong> ${order.receiver.name} (${order.receiver.email})</p>
                    <p class="status-indicator status-${order.status.toLowerCase()}">
                    <strong>Status:</strong> ${order.status}
                </div>
            </div>
        `).join('');
    } catch(error){
        console.error('Error fetching orders:', error);
        orderList.innerHTML = '<p> Error loading orders. Please try again later.</p>';
    }

}

function setupEventListeners(){
    document.querySelectorAll('input[name="orderType"]').forEach(radio=>{
        radio.addEventListener('change', (event)=>{
            currentTypeFilter = event.target.value;
        })
    })

    document.querySelectorAll('input[name="orderStatus"]').forEach(radio=>{
        radio.addEventListener('change', (event=>{
            currentStatusFilter = event.target.value;
        }))
    })

    applyFiltersButton.addEventListener('click', fetchOrders);
}


document.addEventListener("DOMContentLoaded", async()=>{
    const userData = await displayUserName();

    if(userData){
        if (currentUserRole === 'user') {
            typeFiltersContainer.style.display = 'block';
        }else if(currentUserRole==='employee'){
        }else{
            console.warn("Unknown user role:", currentUserRole);
        }
        setupEventListeners();
        fetchOrders();
    }else{
        console.log("User data not loaded, initial setup aborted.");
    }

    
})