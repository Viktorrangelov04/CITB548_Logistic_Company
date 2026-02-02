async function fetchOrders() {
  const list = document.getElementById("ordersList");
  list.innerHTML = "Loading orders...";

  try {
    const res = await fetch("http://localhost:3000/orders", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch orders");

    const orders = await res.json();

    if (!orders.length) {
      list.innerHTML = "<p>No orders found</p>";
      return;
    }

    list.innerHTML = orders
      .map(
        (order) => `
        <div class="border p-2 mb-2 flex justify-between items-center">
          <div>
            <p><strong>Sender:</strong> ${order.sender?.name || "N/A"}</p>
            <p><strong>Receiver:</strong> ${order.receiver?.name || "N/A"}</p>
            <p><strong>Address:</strong> ${order.adress}</p>
            <p><strong>Type:</strong> ${order.type}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Price:</strong> ${order.price}</p>
          </div>

          <div class="flex gap-2">
            <button 
              class="edit-order px-2 bg-blue-500 rounded-md"
              data-id="${order._id}">
              Edit
            </button>

            <button 
              class="delete-order px-2 bg-red-500 rounded-md"
              data-id="${order._id}">
              Delete
            </button>
          </div>
        </div>
      `,
      )
      .join("");

    attachOrderButtons();
  } catch (err) {
    console.error(err);
    list.innerHTML = `<p class="text-red-500">Error loading orders</p>`;
  }
}

function attachOrderButtons() {
  document.querySelectorAll(".delete-order").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (!confirm("Delete this order?")) return;

      await fetch(`http://localhost:3000/orders/${id}`, {
        method: "DELETE",
      });

      fetchOrders();
    });
  });

  document.querySelectorAll(".edit-order").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const newStatus = prompt(
        "Enter new status (processing, shipping, delivered, received)",
      );

      if (!newStatus) return;

      await fetch(`http://localhost:3000/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      fetchOrders();
    });
  });
}
fetchOrders();
