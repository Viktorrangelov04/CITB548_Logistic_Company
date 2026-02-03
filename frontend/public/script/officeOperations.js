async function createOffice() {
  const addressInput = document.getElementById("officeAddress");
  if (!addressInput) return;

  const address = addressInput.value.trim();
  const messageElement = document.getElementById("message");
  messageElement.textContent = "";

  if (!address) {
    messageElement.textContent = "Address is required!";
    messageElement.style.color = "red";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/office", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      messageElement.textContent =
        errorData.message || "Failed to create office";
      messageElement.style.color = "red";
      return;
    }

    messageElement.textContent = "Office created successfully!";
    messageElement.style.color = "green";

    addressInput.value = "";

    fetchOffices();
  } catch (error) {
    console.error("Frontend fetch error:", error);
    messageElement.textContent = "An unexpected error occurred";
    messageElement.style.color = "red";
  }
}

async function fetchOffices(query = "") {
  const list = document.getElementById("officeList");
  if (!list) return;

  list.innerHTML = "Loading...";

  try {
    const res = await fetch("http://localhost:3000/office", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch offices");

    let offices = await res.json();

    if (query && query.length > 0) {
      const lowerQuery = query.toLowerCase();
      offices = offices.filter((office) =>
        office.address.toLowerCase().includes(lowerQuery),
      );
    }

    if (offices.length === 0) {
      list.innerHTML = "<p>No offices found</p>";
      return;
    }

    list.innerHTML = offices
      .map(
        (office) => `
      <div class="office-card border p-2 mb-2 flex justify-between items-center">
        <div>
          <strong>Address:</strong> ${office.address}
        </div>
        <div>
          <button class="delete-office-btn px-2 bg-red-500 hover:underline rounded-md" data-id="${office._id}">Delete</button>
        </div>
      </div>
    `,
      )
      .join("");

    attachOfficeButtons();
  } catch (error) {
    list.innerHTML = `<p class="text-red-500">Error loading offices</p>`;
    console.error(error);
  }
}

async function deleteOffice(id) {
  if (!confirm("Are you sure you want to delete this office?")) return;

  try {
    const res = await fetch(`http://localhost:3000/office/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Error deleting office");
      console.error("Delete error:", data);
      return;
    }

    alert("Office deleted successfully");
    fetchOffices();
  } catch (error) {
    console.error(error);
    alert("Error deleting office");
  }
}

function attachOfficeButtons() {
  const deleteButtons = document.querySelectorAll(".delete-office-btn");
  deleteButtons.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      deleteOffice(id);
    }),
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const createBtn = document.getElementById("createOfficeButton");
  if (createBtn) {
    createBtn.addEventListener("click", createOffice);
  }

  fetchOffices();
});

const searchInput = document.getElementById("searchOfficeInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    fetchOffices(query);
  });
}
