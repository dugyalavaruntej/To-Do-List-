document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToList(task));

    // Add task event
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Task actions
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            deleteTask(e.target.parentElement);
        } else if (e.target.classList.contains('edit-btn')) {
            editTask(e.target.parentElement);
        } else if (e.target.classList.contains('save-btn')) {
            saveTask(e.target.parentElement);
        } else if (e.target.tagName === 'LI') {
            toggleComplete(e.target);
        }
    });

    // Filter tasks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterTasks(btn.dataset.filter);
        });
    });

    // Functions
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const task = {
            text: taskText,
            completed: false,
        };
        addTaskToList(task);
        saveTaskToLocalStorage(task);
        taskInput.value = '';
    }

    function addTaskToList(task) {
        const li = document.createElement('li');
        li.textContent = task.text;

        if (task.completed) {
            li.classList.add('completed');
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    function saveTaskToLocalStorage(task) {
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function deleteTask(taskElement) {
        const taskIndex = Array.from(taskList.children).indexOf(taskElement);
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskElement.remove();
    }

    function editTask(taskElement) {
        const taskIndex = Array.from(taskList.children).indexOf(taskElement);
        const task = tasks[taskIndex];

        if (!taskElement.classList.contains('editing')) {
            taskElement.classList.add('editing');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.text;
            taskElement.textContent = '';
            taskElement.appendChild(input);

            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            saveBtn.classList.add('save-btn');
            taskElement.appendChild(saveBtn);
        }
    }

    function saveTask(taskElement) {
        const taskIndex = Array.from(taskList.children).indexOf(taskElement);
        const input = taskElement.querySelector('input[type="text"]');
        tasks[taskIndex].text = input.value;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskElement.classList.remove('editing');
        taskElement.textContent = input.value;
        taskElement.appendChild(editBtn);
        taskElement.appendChild(deleteBtn);
    }

    function toggleComplete(taskElement) {
        const taskIndex = Array.from(taskList.children).indexOf(taskElement);
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskElement.classList.toggle('completed');
    }

    function filterTasks(filter) {
        Array.from(taskList.children).forEach(taskElement => {
            switch (filter) {
                case 'all':
                    taskElement.style.display = '';
                    break;
                case 'active':
                    if (taskElement.classList.contains('completed')) {
                        taskElement.style.display = 'none';
                    } else {
                        taskElement.style.display = '';
                    }
                    break;
                case 'completed':
                    if (!taskElement.classList.contains('completed')) {
                        taskElement.style.display = 'none';
                    } else {
                        taskElement.style.display = '';
                    }
                    break;
            }
        });
    }
});
