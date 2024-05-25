document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const addBtn = document.querySelector('.add-btn');
    const noTasksText = document.querySelector('.no-tasks-text');

    function updateDateTime() {
        const now = new Date();
        document.getElementById('date').textContent = now.toLocaleDateString();
        document.getElementById('time').textContent = now.toLocaleTimeString();
    }

    function hideNoTasksText() {
        if (taskList.children.length === 0) {
            noTasksText.style.display = 'block';
        } else {
            noTasksText.style.display = 'none';
        }
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('.task-item').forEach(taskItem => {
            const task = {
                text: taskItem.querySelector('span').textContent,
                completed: taskItem.querySelector('input[type="checkbox"]').checked
            };
            tasks.push(task);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                addTask(task.text, task.completed);
            });
        }
    }

    function addTask(taskText, completed = false) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.draggable = true;

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.checked = completed;
        checkBox.addEventListener('change', () => {
            console.log(`Checkbox changed: ${checkBox.checked}`); // Debugging line
            taskSpan.classList.toggle('completed', checkBox.checked);
            taskSpan.offsetWidth; // Force reflow
            console.log(taskSpan.classList); // Debugging line
            saveTasks();
        });

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editBtn.addEventListener('click', () => {
            const newTaskText = prompt('Edit task:', taskText);
            if (newTaskText !== null) {
                taskSpan.textContent = newTaskText;
                saveTasks();
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
            hideNoTasksText();
            saveTasks();
        });

        taskItem.appendChild(checkBox);
        taskItem.appendChild(taskSpan);
        taskItem.appendChild(editBtn);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);

        hideNoTasksText();
        saveTasks();

        // Drag-and-drop functionality
        taskItem.addEventListener('dragstart', handleDragStart);
        taskItem.addEventListener('dragover', handleDragOver);
        taskItem.addEventListener('drop', handleDrop);
        taskItem.addEventListener('dragend', handleDragEnd);
    }

    addBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    updateDateTime();
    setInterval(updateDateTime, 1000);
    hideNoTasksText();
    loadTasks(); // Load tasks from local storage

    // Drag-and-drop handlers
    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = this;
        setTimeout(() => {
            this.style.display = 'none';
        }, 0);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        if (draggedItem !== this) {
            taskList.insertBefore(draggedItem, this);
            saveTasks();
        }
    }

    function handleDragEnd(e) {
        this.style.display = 'flex';
        draggedItem = null;
    }
});
