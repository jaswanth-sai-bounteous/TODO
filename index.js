let todo = [];

// DOM Elements
const addBtn = document.getElementById("addBtn");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");
const form = document.getElementById("taskForm");

const editModal = document.getElementById("editModal");
const closeEdit = document.querySelector(".close-edit");
const editForm = document.getElementById("editForm");
const deleteBtn = document.getElementById("deleteTask");

let currentEditIndex = null;

// Show / hide modals
addBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
closeEdit.onclick = () => editModal.style.display = "none";

// Save todo array to localStorage
function saveTodo() {
    localStorage.setItem("todoList", JSON.stringify(todo));
}

// Load todo array from localStorage
function loadTodo() {
    const saved = localStorage.getItem("todoList");
    if (saved) {
        todo = JSON.parse(saved);
    }
}

// Render tasks with TIME-based color logic
function renderTodo() {
    document.querySelector(".todo").innerHTML = "<h2>To Do</h2>";
    document.querySelector(".inprogress").innerHTML = "<h2>In Progress</h2>";
    document.querySelector(".done").innerHTML = "<h2>Done</h2>";

    const now = new Date();
    const oneHour = 60 * 60 * 1000;

    todo.forEach((t, index) => {
        let color = "green";

        if (t.deadline) {
            const [hours, minutes] = t.deadline.split(":");

            const deadlineDate = new Date();
            deadlineDate.setHours(hours, minutes, 0, 0);

            const timeLeft = deadlineDate - now;

            if (timeLeft <= 0) {
                color = "maroon";      
            } else if (timeLeft <= oneHour) {
                color = "yellow";      
            } else {
                color = "green";
            }
        }

        const itemBtn = `
            <button
                style="background-color:${color}; color:black;"
                onclick="editTask(${index})"
            >
                ${t.title}
            </button>
        `;

        if (t.progress === "todo") {
            document.querySelector(".todo").innerHTML += `<div class="item">${itemBtn}</div>`;
        } 
        else if (t.progress === "inprogress") {
            document.querySelector(".inprogress").innerHTML += `<div class="item">${itemBtn}</div>`;
        } 
        else if (t.progress === "done") {
            document.querySelector(".done").innerHTML += `<div class="item">${itemBtn}</div>`;
        }
    });
}

// Add new task
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("task").value;
    const progress = document.getElementById("status").value;
    const deadlineInput = document.getElementById("deadline").value;

    todo.push({
        title,
        progress,
        deadline: deadlineInput
    });

    saveTodo();
    renderTodo();
    form.reset();
    modal.style.display = "none";
});

// Edit task
window.editTask = function (index) {
    currentEditIndex = index;
    const task = todo[index];

    document.getElementById("editTask").value = task.title;
    document.getElementById("editStatus").value = task.progress;
    document.getElementById("editDeadline").value = task.deadline;

    editModal.style.display = "block";
};

// Update task
editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const task = todo[currentEditIndex];
    task.title = document.getElementById("editTask").value;
    task.progress = document.getElementById("editStatus").value;
    task.deadline = document.getElementById("editDeadline").value;

    saveTodo();
    renderTodo();
    editModal.style.display = "none";
});

// Delete task
deleteBtn.onclick = function () {
    todo.splice(currentEditIndex, 1);
    saveTodo();
    renderTodo();
    editModal.style.display = "none";
};

// Initial load
loadTodo();
renderTodo();

// Refresh colors every 30 seconds
setInterval(renderTodo, 30000);
