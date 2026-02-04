let todo = [];

const addBtn = document.getElementById("addBtn");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");
const form = document.getElementById("taskForm");

const editModal = document.getElementById("editModal");
const closeEdit = document.querySelector(".close-edit");
const editForm = document.getElementById("editForm");
const deleteBtn = document.getElementById("deleteTask");

let currentEditIndex = null;

// Show/hide modals
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

// Render tasks with color-coded deadlines
function renderTodo() {
    document.querySelector(".todo").innerHTML = "<h2>To Do</h2>";
    document.querySelector(".inprogress").innerHTML = "<h2>In Progress</h2>";
    document.querySelector(".done").innerHTML = "<h2>Done</h2>";

    const now = new Date();

    todo.forEach((t, index) => {
        let color = "green"; // default green

        if (t.deadline && t.createdAt) {
            const deadlineDate = new Date(t.deadline);
            const startDate = new Date(t.createdAt); // use task creation date
            const totalTime = deadlineDate - startDate; // total ms
            const timeLeft = deadlineDate - now; // remaining ms
            const percentLeft = Math.max(0, (timeLeft / totalTime) * 100);

            if (percentLeft < 50 && percentLeft > 0) {
                color = "yellow";
            } else if (percentLeft <= 0) {
                color = "maroon";
            }
        }

        const itemBtn = `<button style="background-color:${color}" onclick="editTask(${index})">${t.title}</button>`;

        if (t.progress === "todo") {
            document.querySelector(".todo").innerHTML += `<div class="item">${itemBtn}</div>`;
        } else if (t.progress === "inprogress") {
            document.querySelector(".inprogress").innerHTML += `<div class="item">${itemBtn}</div>`;
        } else if (t.progress === "done") {
            document.querySelector(".done").innerHTML += `<div class="item">${itemBtn}</div>`;
        }
    });
}

// Add new task
form.addEventListener("submit", function(e){
    e.preventDefault();
    const title = document.getElementById("task").value;
    const progress = document.getElementById("status").value;
    const deadlineInput = document.getElementById("deadline").value;

    todo.push({
        no: todo.length + 1,
        title,
        deadline: deadlineInput,
        progress,
        createdAt: new Date().toISOString() // store creation date
    });

    saveTodo();
    renderTodo();
    form.reset();
    modal.style.display = "none";
});

// Edit task
window.editTask = function(index) {
    currentEditIndex = index;
    const task = todo[index];
    document.getElementById("editTask").value = task.title;
    document.getElementById("editStatus").value = task.progress;
    document.getElementById("editDeadline").value = task.deadline;

    editModal.style.display = "block";
}

editForm.addEventListener("submit", function(e){
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
deleteBtn.onclick = function() {
    todo.splice(currentEditIndex, 1);
    saveTodo();
    renderTodo();
    editModal.style.display = "none";
}

// Load tasks and render on page load
loadTodo();
renderTodo();

// Optional: auto-update colors every minute
setInterval(renderTodo, 60000);
