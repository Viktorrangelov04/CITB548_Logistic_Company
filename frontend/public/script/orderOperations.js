document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById("orderForm");

  const officeBox = document.getElementById("officeBox");
  const addressBox = document.getElementById("addressBox");

  const officeSelect = document.getElementById("offices");
  const receiverSelect = document.getElementById("receiver");
  const courierSelect = document.getElementById("courier");

  const message = document.getElementById("message");

  document.querySelectorAll('input[name="type"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "office") {
        officeBox.style.display = "block";
        addressBox.style.display = "none";
      } else {
        officeBox.style.display = "none";
        addressBox.style.display = "block";
      }
    });
  });

  loadOffices();
  loadReceivers();
  loadCouriers();

  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await createOrder();
  });

  async function loadOffices() {
    try {
      const res = await fetch("http://localhost:3000/office", {
        credentials: "include",
      });
      const offices = await res.json();

      officeSelect.innerHTML = "";

      offices.forEach((office) => {
        const option = document.createElement("option");
        option.value = office._id;
        option.textContent = `${office.address}`;
        officeSelect.appendChild(option);
      });
    } catch (err) {
      officeSelect.innerHTML = `<option>Error loading offices</option>`;
      console.error(err);
    }
  }

  async function loadReceivers() {
    try {
      const res = await fetch("http://localhost:3000/users", {
        credentials: "include",
      });
      const users = await res.json();

      receiverSelect.innerHTML = "";

      users.forEach((user) => {
        const option = document.createElement("option");
        option.value = user._id;
        option.textContent = `${user.name} (${user.email})`;
        receiverSelect.appendChild(option);
      });
    } catch (err) {
      receiverSelect.innerHTML = `<option>Error loading receivers</option>`;
      console.error(err);
    }
  }

  async function loadCouriers() {
    try {
      const res = await fetch(
        "http://localhost:3000/users?role=employee-courier",
        { credentials: "include" },
      );
      const couriers = await res.json();

      courierSelect.innerHTML = "";

      couriers.forEach((courier) => {
        const option = document.createElement("option");
        option.value = courier._id;
        option.textContent = courier.name;
        courierSelect.appendChild(option);
      });
    } catch (err) {
      courierSelect.innerHTML = `<option>Error loading couriers</option>`;
      console.error(err);
    }
  }

  async function createOrder() {
    const type = document.querySelector('input[name="type"]:checked').value;
    const weight = document.getElementById("weight").value;

    const storedUserId = localStorage.getItem("userId");

    const orderData = {
      sender_id: storedUserId,
      receiver_id: receiverSelect.value,
      courier_id: courierSelect.value,
      type,
      weight,
      address:
        type === "address"
          ? document.getElementById("address").value
          : "Office delivery",
      office: type === "office" ? officeSelect.value : null,
    };

    if (type === "office") {
      orderData.office = officeSelect.value;
    } else {
      orderData.address = document.getElementById("address").value;
    }

    try {
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      message.textContent = "Order created successfully!";
      message.className = "text-green-600";

      orderForm.reset();
      officeBox.style.display = "none";
      addressBox.style.display = "none";
    } catch (err) {
      message.textContent = err.message;
      message.className = "text-red-500";
      console.error(err);
    }
  }
});
