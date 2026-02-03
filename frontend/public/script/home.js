let currentUserId = null;
let currentUserRole = null;

async function displayUserName() {
    try {
        const response = await fetch("http://localhost:3000/auth/me", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                window.location.href = "/frontend/public/login.html";
                return null;
            }
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch user data");
        }

        const userData = await response.json();

        currentUserId = userData.id;
        currentUserRole = userData.role;
        localStorage.setItem("userId", userData.id);

        const userNameDisplay = document.getElementById("userNameDisplay");
        if (userNameDisplay) {
            userNameDisplay.textContent = userData.name || "user";
        }
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

const typeFiltersContainer = document.getElementById("type-filters");
const orderList = document.getElementById("order-list");
const applyFiltersButton = document.getElementById("applyFiltersBtn");

let currentTypeFilter = "all";
let currentStatusFilter = "all";

async function fetchOrders() {
  const statusOptions = ["processing", "shipping", "delivered", "received"];

  if (!orderList) return;

  let url = "http://localhost:3000/orders?";
  const params = [];

  if (currentStatusFilter !== "all") {
    params.push(`status=${currentStatusFilter}`);
  }

  if (currentUserRole === "client" && currentTypeFilter !== "all") {
    params.push(`type=${currentTypeFilter}`);
  }

  url += params.join("&");

  try {
    orderList.innerHTML = "Loading orders...";

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Forbidden");
    }

    const orders = await response.json();

    if (orders.length === 0) {
      orderList.innerHTML = "<p>No orders found matching your criteria.</p>";
      return;
    }

    orderList.innerHTML = orders
      .map((order) => {
        const senderName =
          order.sender?.name || order.sender_id?.name || "Unknown";
        const receiverName =
          order.receiver?.name || order.receiver_id?.name || "Unknown";

        const isEmployee =
          currentUserRole === "employee-office" ||
          currentUserRole === "employee-courier";

        const statusHtml = isEmployee
          ? `<select class="status-updater border rounded p-1" data-id="${order._id}">
                ${statusOptions
                  .map(
                    (opt) =>
                      `<option value="${opt}" ${
                        order.status === opt ? "selected" : ""
                      }>${opt}</option>`
                  )
                  .join("")}
             </select>`
          : `<span class="status-tag">${order.status}</span>`;

        return `
            <div class="order-item p-4 border mb-2 rounded shadow-sm flex justify-between items-center">
                <div class="order-details">
                    <p><strong>From:</strong> ${senderName}</p>
                    <p><strong>To:</strong> ${receiverName}</p>
                    <p><strong>Status:</strong> ${statusHtml}</p>
                </div>
            </div>
        `;
      })
      .join("");

    const isEmployee =
      currentUserRole === "employee-office" ||
      currentUserRole === "employee-courier";

    if (isEmployee) {
      attachStatusListeners();
    }
  } catch (error) {
    console.error("Fetch orders error:", error);
    orderList.innerHTML = "<p> Error loading orders.</p>";
  }
}

function attachStatusListeners() {
  document.querySelectorAll(".status-updater").forEach((select) => {
    select.addEventListener("change", async (event) => {
      const orderId = event.target.dataset.id;
      const newStatus = event.target.value;

      event.target.disabled = true;

      try {
        const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update status");
        }

        event.target.classList.add("bg-green-100");
        setTimeout(() => event.target.classList.remove("bg-green-100"), 1000);
      } catch (err) {
        console.error("Update error:", err);
        alert("Error updating order: " + err.message);
        fetchOrders();
      } finally {
        event.target.disabled = false;
      }
    });
  });
}

function setupEventListeners() {
    const typeRadios = document.querySelectorAll('input[name="orderType"]');
    typeRadios.forEach((radio) => {
        radio.addEventListener("change", (event) => {
            currentTypeFilter = event.target.value;
        });
    });

    const statusSelect = document.getElementById("orderStatus");
    if (statusSelect) {
        statusSelect.addEventListener("change", (event) => {
            currentStatusFilter = event.target.value;
        });
    }

    if (applyFiltersButton) {
        applyFiltersButton.addEventListener("click", fetchOrders);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const userData = await displayUserName();

    if (userData) {
        if (currentUserRole === "user" && typeFiltersContainer) {
            typeFiltersContainer.style.display = "block";
        }

        setupEventListeners();

        if (orderList) {
            fetchOrders();
        }
    }
});
