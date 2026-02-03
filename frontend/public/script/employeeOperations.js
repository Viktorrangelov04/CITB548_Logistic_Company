// asynchronously create employees by using user input in the Add Employee section from the Employee Management Portal
async function createEmployee() {
  // get trimmed employee details input
  const name = document.getElementById("employeeName").value.trim();
  const email = document.getElementById("employeeEmail").value.trim();
  const password = document.getElementById("employeePassword").value.trim();
  const role = document
    .querySelector('input[name="employeeRole"]:checked')
    ?.value.trim()
    .toLowerCase();

  // final message which will be displayed once creation is initiated
  const messageElement = document.getElementById("message");
  messageElement.textContent = "";

  // in case any of the fields is empty, a message is displayed to the user
  if (!name || !email || !password || !role) {
    messageElement.textContent = "All fields are required!";
    messageElement.style.color = "red";
    return;
  }

  // validation of the email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/; // email regex to validate input
  if (!emailRegex.test(email)) {
    const messageElement = document.getElementById("message");
    messageElement.textContent =
      "Please enter a valid email! (example@example.com)";
    messageElement.style.color = "red";
    return;
  }

  // attempt to add the employee to the user list
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    });

    // in case user is unauthorized or access to this page is forbidden, redirect to login page
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = "/frontend/public/login.html";
        return null;
      }

      // in case of any issue, a message is shown to the user
      const errorData = await response.json();
      messageElement.textContent =
        errorData.message || "Failed to create employee";
      messageElement.style.color = "red";
      return;
    }

    // if request is successful, a success message is displayed
    messageElement.textContent = "Employee created successfully";
    messageElement.style.color = "green";

    // cleanup of the populated fields
    document.getElementById("employeeName").value = "";
    document.getElementById("employeeEmail").value = "";
    document.getElementById("employeePassword").value = "";
    document.querySelector(
      'input[name="employeeRole"][value="employee-office"]',
    ).checked = true;

    // update employee list
    fetchEmployees();
  } catch (error) {
    // in case of any other issue, a message is displayed
    messageElement.textContent = "An unexpected error occurred";
    messageElement.style.color = "red";
    console.error("Frontend fetch error:", error);
  }
}

// an event listener on the button to create an employee
document.addEventListener("DOMContentLoaded", () => {
  const createBtn = document.getElementById("createEmployeeButton");
  if (createBtn) {
    createBtn.addEventListener("click", createEmployee);
  }
});

// display a list of all the employees currently present in the database + an option to edit/delete each employee
async function fetchEmployees(query = "") {
  const roleLabels = {
    "employee-office": "Regular employee",
    "employee-courier": "Courier",
  };

  const list = document.getElementById("employeeList");
  list.innerHTML = "Loading...";

  try {
    const res = await fetch("http://localhost:3000/users");

    if (!res.ok) throw new Error("Failed to fetch employees");

    let employees = await res.json();

    if (query && query.length > 0) {
      const lowerQuery = query.toLowerCase();
      employees = employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(lowerQuery) ||
          emp.email.toLowerCase().includes(lowerQuery),
      );
    } else {
      employees = employees;
    }

    if (employees.length === 0) {
      list.innerHTML = "<p>No employees found</p>";
      return;
    }

    list.innerHTML = employees
      .map(
        (emp) => `
      <div class="employee-card border p-2 mb-2 flex justify-between items-center">
        <div>
          <strong>Name: ${emp.name}</strong> (Email: ${emp.email}) - Role: ${roleLabels[emp.role] || emp.role}
        </div>
        <div>
          <button class="edit-btn px-2 bg-blue-500 hover:underline rounded-md" data-id="${emp._id}" data-role="${emp.role}">Edit</button>
          <button class="delete-emp-btn px-2 bg-red-500 hover:underline rounded-md" data-id="${emp._id}">Delete</button>
        </div>
      </div>
    `,
      )
      .join("");

    // attach delete & edit event listeners
    if (employees.length > 0) {
      attachEmployeeButtons();
    }
  } catch (error) {
    list.innerHTML = `<p class="text-red-500">Error loading employees</p>`;
    console.error(error);
  }
}

function attachEmployeeButtons() {
  const deleteButtons = document.querySelectorAll(".delete-emp-btn");
  const editButtons = document.querySelectorAll(".edit-btn");

  if (deleteButtons.length === 0 && editButtons.length === 0) return;
  document.querySelectorAll(".delete-emp-btn").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (confirm("Are you sure you want to delete this employee?")) {
        await deleteEmployee(id);
      }
    }),
  );

  document.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const role = e.target.dataset.role;
      editEmployee(id, role);
    }),
  );
}

// delete an employee
async function deleteEmployee(id) {
  try {
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();

    // if there is an error, for example unlogged user trying to delete an employee, a message is displayed
    if (!res.ok) {
      alert(data.message || "Error deleting employee");
      console.error("Delete error:", data);
      return;
    }
    alert("Employee deleted"); // if the operation is successful, a message is displayed

    // the list of employees is updated to reflect new headcount
    fetchEmployees();
  } catch (error) {
    console.error(error);
    alert("Error deleting employee");
  }
}

function editEmployee(id) {
  const name = prompt("Enter new name");
  const role = prompt("Enter new role (user/employee)");

  if (!name || !role) return;

  fetch(`http://localhost:3000/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ role }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to update employee");
      return res.json();
    })
    .then((data) => {
      alert("Employee updated");
      fetchEmployees();
    })
    .catch((err) => {
      console.error(err);
      alert("Error updating employee");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("employeeList");
  if (list) {
    fetchEmployees();
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      fetchEmployees(query);
    });
  }
});
