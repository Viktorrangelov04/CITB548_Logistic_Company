export async function fetchOrders(){
    const currentUserRole = 'user';
    const typeFiltersContainer = document.getElementById('type-filters');
    const statusFiltersContainer = document.getElementById('status-filters');
    const orderList = document.getElementById('order-list');
    const applyFiltersButton = document.getElementById('applyFiltersBtn');

    let currentTypeFilter='all';
    let currentStatusFilter='all';

    let url = '/orders?'
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

        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`Error: ${response.status}`);
        }

        const orders = await response.json();

        if(orders.length === 0){
            orderList.innerHTML='<p>No orders found matching your criteria.</p>';
            return;
        }

        orderList.innerHTML = orders.map(order=>`
            <div class ="order-item">
                <p><strong>Item:</strong>${order.item}</p>
                <p><strong>From:</strong>${order.sender.name}</p>
                <p><strong>To:</strong>${order.receiver.name}</p>
                <p><strong>Status:</strong>${order.status}</p>
            </div>
        `).join('');
    } catch(error){
        console.error('Error fetching orders:', error);
        orderList.innerHTML = '<p> Error loading orders. Please try again later.</p>';
    }

}

document.addEventListener("DOMContentLoaded", ()=>{

})