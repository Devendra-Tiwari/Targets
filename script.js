document.addEventListener('DOMContentLoaded', () => {
    const subjects = [
        { name: 'Chemistry', tasks: ['Lec', 'Notes', 'Revision', 'NCERT', 'DPP', 'DPP Analysis', 'Modules'] },
        { name: 'Botany', tasks: ['Lec', 'Notes', 'Revision', 'NCERT', 'DPP', 'DPP Analysis', 'Modules'] },
        { name: 'Zoology', tasks: ['Lec', 'Notes', 'Revision', 'NCERT', 'DPP', 'DPP Analysis', 'Modules'] },
        { name: 'Physics', tasks: ['Lec', 'Notes', 'Revision', 'NCERT', 'DPP', 'DPP Analysis', 'Modules'] }
    ];

    const subjectsContainer = document.getElementById('subjectsContainer');
    const currentDateElement = document.getElementById('currentDate');
    const previousDayBtn = document.getElementById('previousDayBtn');
    const nextDayBtn = document.getElementById('nextDayBtn');

    let currentDate = new Date();

    function renderDate() {
        currentDateElement.textContent = currentDate.toDateString();
    }

    function saveTasks() {
        const tasks = {};
        subjects.forEach(subject => {
            tasks[subject.name] = [];
            const taskElements = document.querySelectorAll(`#${subject.name} .task`);
            taskElements.forEach(taskElement => {
                const taskName = taskElement.dataset.task;
                const completed = taskElement.querySelector('input[type="checkbox"]').checked;
                const completionTime = taskElement.dataset.completionTime || null;
                tasks[subject.name].push({ name: taskName, completed, completionTime });
            });
        });
        localStorage.setItem(currentDate.toDateString(), JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem(currentDate.toDateString())) || {};
        subjectsContainer.innerHTML = '';
        subjects.forEach(subject => {
            const subjectDiv = document.createElement('div');
            subjectDiv.className = 'subject';
            subjectDiv.id = subject.name;

            const subjectTitle = document.createElement('h2');
            subjectTitle.textContent = subject.name;

            const addTaskIcon = document.createElement('span');
            addTaskIcon.className = 'add-task';
            addTaskIcon.textContent = '✏️';
            addTaskIcon.addEventListener('click', () => {
                const taskName = prompt('Enter task name:');
                if (taskName) {
                    addTask(subjectDiv, taskName, false, null);
                    saveTasks();
                }
            });

            subjectTitle.appendChild(addTaskIcon);
            subjectDiv.appendChild(subjectTitle);

            const pendingTasks = tasks[subject.name]?.filter(task => !task.completed) || subject.tasks.map(task => ({ name: task, completed: false }));
            const completedTasks = tasks[subject.name]?.filter(task => task.completed) || [];

            pendingTasks.forEach(task => addTask(subjectDiv, task.name, false, task.completionTime));
            completedTasks.forEach(task => addTask(subjectDiv, task.name, true, task.completionTime));

            subjectsContainer.appendChild(subjectDiv);
        });
    }

    function addTask(subjectDiv, taskName, isCompleted, completionTime) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        taskDiv.dataset.task = taskName;
        taskDiv.dataset.completionTime = completionTime;

        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.checked = isCompleted;
        taskCheckbox.addEventListener('change', () => {
            const now = new Date();
            const completionInfo = isCompleted ? null : `Completed on ${now.toDateString()} at ${now.toLocaleTimeString()}`;
            taskDiv.dataset.completionTime = completionInfo || null;
            taskDiv.querySelector('.completed-info')?.remove();
            if (completionInfo) {
                taskDiv.classList.add('completed');
            } else {
                taskDiv.classList.remove('completed');
            }
            saveTasks();
        });

        const taskLabel = document.createElement('label');
        taskLabel.textContent = taskName;

        const removeButton = document.createElement('span');
        removeButton.className = 'remove-task';
        removeButton.textContent = '❌';
        removeButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove this task?')) {
                taskDiv.remove();
                saveTasks();
            }
        });

        const completionTimeButton = document.createElement('span');
        completionTimeButton.className = 'completion-time';
        completionTimeButton.textContent = '⏰';
        completionTimeButton.addEventListener('click', () => {
            const completionInfo = taskDiv.dataset.completionTime;
            if (completionInfo) {
                alert(completionInfo);
            } else {
                alert('Task not completed yet.');
            }
        });

        taskDiv.appendChild(taskCheckbox);
        taskDiv.appendChild(taskLabel);
        taskDiv.appendChild(removeButton);
        taskDiv.appendChild(completionTimeButton);

        if (completionTime) {
            taskDiv.classList.add('completed');
        }

        subjectDiv.appendChild(taskDiv);
    }

    function changeDay(days) {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + days);
        if (newDate >= new Date(2024, 6, 20)) {
            currentDate = newDate;
            renderDate();
            loadTasks();
        } else {
            alert('Cannot go before July 20, 2024');
        }
    }

    previousDayBtn.addEventListener('click', () => changeDay(-1));
    nextDayBtn.addEventListener('click', () => changeDay(1));

    renderDate();
    loadTasks();
});
