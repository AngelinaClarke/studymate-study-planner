/* =========================================
   STUDENT STUDY PLANNER
========================================= */


/* =========================================
   GET ELEMENTS
========================================= */

const taskForm = document.getElementById("taskForm");

const taskTitle = document.getElementById("taskTitle");

const subject = document.getElementById("subject");

const taskDate = document.getElementById("taskDate");

const priority = document.getElementById("priority");

const progress = document.getElementById("progress");

const editTaskId = document.getElementById("editTaskId");

const submitBtn = document.getElementById("submitBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const taskList =
    document.getElementById("taskList");

const searchInput =
    document.getElementById("searchInput");

const filterPriority =
    document.getElementById("filterPriority");

const filterStatus =
    document.getElementById("filterStatus");

const subjectProgress =
    document.getElementById("subjectProgress");

const plannerView =
    document.getElementById("plannerView");

const dailyBtn =
    document.getElementById("dailyBtn");

const weeklyBtn =
    document.getElementById("weeklyBtn");

const darkModeBtn =
    document.getElementById("darkModeBtn");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const overallProgress =
    document.getElementById("overallProgress");

const recommendationText =
    document.getElementById("recommendationText");

const goalInput =
    document.getElementById("goalInput");

const addGoalBtn =
    document.getElementById("addGoalBtn");

const goalList =
    document.getElementById("goalList");



/* =========================================
   LOCAL STORAGE
========================================= */

let tasks =
    JSON.parse(localStorage.getItem("studyTasks")) || [];

let goals =
    JSON.parse(localStorage.getItem("studyGoals")) || [];



/* =========================================
   SAVE TASKS
========================================= */

function saveTasks() {

    localStorage.setItem(
        "studyTasks",
        JSON.stringify(tasks)
    );

}



/* =========================================
   SAVE GOALS
========================================= */

function saveGoals() {

    localStorage.setItem(
        "studyGoals",
        JSON.stringify(goals)
    );

}



/* =========================================
   ADD / EDIT TASK
========================================= */

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const title =
        taskTitle.value.trim();

    const subjectValue =
        subject.value.trim();

    const date =
        taskDate.value;

    const priorityValue =
        priority.value;

    const progressValue =
        Number(progress.value);


    if (
        !title ||
        !subjectValue ||
        !date
    ) {

        alert("Please fill all required fields.");

        return;
    }


    /* EDIT TASK */

    if (editTaskId.value) {

        const task =
            tasks.find(
                t => t.id == editTaskId.value
            );


        if (task) {

            task.title =
                title;

            task.subject =
                subjectValue;

            task.date =
                date;

            task.priority =
                priorityValue;

            task.progress =
                progressValue;

        }


        alert("Task updated successfully!");

    }


    /* ADD NEW TASK */

    else {

        const newTask = {

            id: Date.now(),

            title: title,

            subject: subjectValue,

            date: date,

            priority: priorityValue,

            progress: progressValue,

            completed:
                progressValue === 100

        };


        tasks.push(newTask);


        alert("Task added successfully!");

    }


    saveTasks();

    resetForm();

    renderAll();

});



/* =========================================
   RESET FORM
========================================= */

function resetForm() {

    taskForm.reset();

    editTaskId.value = "";

    progress.value = 0;

    submitBtn.textContent =
        "Add Task";

    cancelEditBtn.style.display =
        "none";

}



/* =========================================
   EDIT TASK
========================================= */

function editTask(id) {

    const task =
        tasks.find(
            t => t.id === id
        );


    if (!task) return;


    taskTitle.value =
        task.title;

    subject.value =
        task.subject;

    taskDate.value =
        task.date;

    priority.value =
        task.priority;

    progress.value =
        task.progress;

    editTaskId.value =
        task.id;


    submitBtn.textContent =
        "Update Task";

    cancelEditBtn.style.display =
        "inline-block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



/* =========================================
   CANCEL EDIT
========================================= */

cancelEditBtn.addEventListener(
    "click",
    resetForm
);



/* =========================================
   DELETE TASK
========================================= */

function deleteTask(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmation) return;


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderAll();

}



/* =========================================
   MARK COMPLETED
========================================= */

function toggleComplete(id) {

    const task =
        tasks.find(
            t => t.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    if (task.completed) {

        task.progress = 100;

    }
    else {

        task.progress = 0;

    }


    saveTasks();

    renderAll();

}



/* =========================================
   DISPLAY TASKS
========================================= */

function renderTasks() {

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const selectedPriority = filterPriority.value;
    const selectedStatus = filterStatus.value;

    const filteredTasks = tasks.filter(function(task) {

        const title = String(task.title || "").toLowerCase();
        const subject = String(task.subject || "").toLowerCase();

        const matchesSearch =
            searchText === "" ||
            title.includes(searchText) ||
            subject.includes(searchText);

        const matchesPriority =
            selectedPriority === "All" ||
            task.priority === selectedPriority;

        const matchesStatus =
            selectedStatus === "All" ||
            (selectedStatus === "Completed" && task.completed) ||
            (selectedStatus === "Pending" && !task.completed);

        return (
            matchesSearch &&
            matchesPriority &&
            matchesStatus
        );

    });


    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <p class="empty-message">
                No tasks found.
            </p>
        `;

        return;
    }


    filteredTasks.sort(function(a, b) {

        return new Date(a.date) - new Date(b.date);

    });


    taskList.innerHTML = filteredTasks.map(function(task) {

        const priorityClass =
            String(task.priority).toLowerCase();

        return `

            <div class="task-card ${task.completed ? "completed" : ""}">

                <div class="task-header">

                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    <span class="
                        badge
                        priority-${priorityClass}
                    ">
                        ${task.priority}
                    </span>

                </div>


                <div class="task-details">

                    <span class="badge subject-badge">
                        📚 ${escapeHTML(task.subject)}
                    </span>

                    <span class="badge">
                        📅 ${formatDate(task.date)}
                    </span>

                    <span class="badge">
                        ${task.completed ? "✅ Completed" : "⏳ Pending"}
                    </span>

                </div>


                <div class="progress-container">

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width: ${task.progress}%"
                        ></div>

                    </div>

                    <span class="progress-text">
                        ${task.progress}% completed
                    </span>

                </div>


                <div class="task-actions">

                    <button
                        class="complete-btn"
                        onclick="toggleComplete(${task.id})"
                    >
                        ${
                            task.completed
                            ? "↩️ Mark Pending"
                            : "✅ Complete"
                        }
                    </button>


                    <button
                        class="edit-btn"
                        onclick="editTask(${task.id})"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteTask(${task.id})"
                    >
                        🗑️ Delete
                    </button>

                </div>

            </div>

        `;

    }).join("");

} 

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}



/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}



/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    let average = 0;


    if (total > 0) {

        const totalProgress =
            tasks.reduce(
                (
                    sum,
                    task
                ) =>
                    sum +
                    Number(task.progress),
                0
            );


        average =
            Math.round(
                totalProgress / total
            );

    }


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;

    overallProgress.textContent =
        average + "%";

}



/* =========================================
   SUBJECT-WISE PROGRESS
========================================= */

function renderSubjectProgress() {

    if (tasks.length === 0) {

        subjectProgress.innerHTML = `
            <p class="empty-message">
                Add tasks to see subject-wise progress.
            </p>
        `;

        return;
    }


    const subjects = {};


    tasks.forEach(task => {

        if (!subjects[task.subject]) {

            subjects[task.subject] = {

                total: 0,

                progress: 0

            };

        }


        subjects[task.subject].total++;

        subjects[task.subject].progress +=
            Number(task.progress);

    });


    subjectProgress.innerHTML =
        Object.keys(subjects)
            .map(subjectName => {

                const data =
                    subjects[subjectName];


                const average =
                    Math.round(
                        data.progress /
                        data.total
                    );


                return `

                    <div class="
                        subject-progress
                    ">

                        <div class="
                            subject-name
                        ">

                            ${escapeHTML(
                                subjectName
                            )}

                            -
                            ${average}%

                        </div>


                        <div class="
                            subject-progress-bar
                        ">

                            <div
                                class="
                                subject-progress-fill
                                "
                                style="
                                width:${average}%
                                "
                            ></div>

                        </div>

                    </div>

                `;

            })
            .join("");

}



/* =========================================
   DAILY / WEEKLY PLANNER
========================================= */

function renderDailyPlanner() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayTasks =
        tasks.filter(
            task => task.date === today
        );


    if (todayTasks.length === 0) {

        plannerView.innerHTML = `
            <p class="empty-message">
                No tasks scheduled for today.
            </p>
        `;

        return;
    }


    plannerView.innerHTML =
        todayTasks.map(task => `

            <div class="planner-day">

                <h3>
                    ${escapeHTML(
                        task.title
                    )}
                </h3>

                <p>
                    📚
                    ${escapeHTML(
                        task.subject
                    )}
                </p>

                <p>
                    Priority:
                    ${task.priority}
                </p>

                <p>
                    Progress:
                    ${task.progress}%
                </p>

            </div>

        `).join("");

}



function renderWeeklyPlanner() {

    const today =
        new Date();


    const weekTasks = [];


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(today);


        date.setDate(
            today.getDate() + i
        );


        const dateString =
            date.toISOString()
                .split("T")[0];


        const dayTasks =
            tasks.filter(
                task =>
                    task.date ===
                    dateString
            );


        weekTasks.push({

            date:
                dateString,

            tasks:
                dayTasks

        });

    }


    plannerView.innerHTML =
        weekTasks.map(day => {

            const date =
                new Date(
                    day.date +
                    "T00:00:00"
                );


            return `

                <div class="
                    planner-day
                ">

                    <h3>

                        ${date.toLocaleDateString(
                            "en-IN",
                            {
                                weekday:
                                    "long",
                                day:
                                    "numeric",
                                month:
                                    "short"
                            }
                        )}

                    </h3>


                    ${
                        day.tasks.length === 0

                        ?

                        "<p>No tasks</p>"

                        :

                        day.tasks
                            .map(
                                task => `

                                    <p>

                                        ${
                                            task.completed
                                            ? "✅"
                                            : "📖"
                                        }

                                        ${escapeHTML(
                                            task.title
                                        )}

                                        -
                                        ${task.progress}%

                                    </p>

                                `
                            )
                            .join("")
                    }

                </div>

            `;

        }).join("");

}



/* =========================================
   DAILY / WEEKLY BUTTONS
========================================= */

dailyBtn.addEventListener(
    "click",
    function() {

        dailyBtn.classList.add(
            "active"
        );

        weeklyBtn.classList.remove(
            "active"
        );

        renderDailyPlanner();

    }
);


weeklyBtn.addEventListener(
    "click",
    function() {

        weeklyBtn.classList.add(
            "active"
        );

        dailyBtn.classList.remove(
            "active"
        );

        renderWeeklyPlanner();

    }
);



/* =========================================
   SEARCH / FILTER
========================================= */

searchInput.addEventListener("input", function () {
    renderTasks();
});

filterPriority.addEventListener("change", function () {
    renderTasks();
});

filterStatus.addEventListener("change", function () {
    renderTasks();
});

/* =========================================
   DARK MODE
========================================= */

darkModeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );


        const dark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            dark
        );


        darkModeBtn.textContent =
            dark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";

    }
);


/* Load dark mode */

if (
    localStorage.getItem(
        "darkMode"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );

    darkModeBtn.textContent =
        "☀️ Light Mode";

}



/* =========================================
   GOALS
========================================= */

function renderGoals() {

    if (goals.length === 0) {

        goalList.innerHTML = `
            <p class="empty-message">
                No goals added yet.
            </p>
        `;

        return;
    }


    goalList.innerHTML =
        goals.map(
            goal => `

                <div class="
                    goal-item
                    ${
                        goal.completed
                        ? "completed"
                        : ""
                    }
                ">

                    <span
                        onclick="
                        toggleGoal(
                            ${goal.id}
                        )"
                        style="
                        cursor:pointer;
                        "
                    >

                        ${
                            goal.completed
                            ? "✅"
                            : "⬜"
                        }

                        ${escapeHTML(
                            goal.text
                        )}

                    </span>


                    <button
                        onclick="
                        deleteGoal(
                            ${goal.id}
                        )"
                    >

                        🗑️

                    </button>

                </div>

            `
        ).join("");

}



addGoalBtn.addEventListener(
    "click",
    function() {

        const text =
            goalInput.value.trim();


        if (!text) {

            alert(
                "Please enter a goal."
            );

            return;
        }


        goals.push({

            id: Date.now(),

            text: text,

            completed: false

        });


        goalInput.value = "";

        saveGoals();

        renderGoals();

    }
);



function toggleGoal(id) {

    const goal =
        goals.find(
            g => g.id === id
        );


    if (goal) {

        goal.completed =
            !goal.completed;

    }


    saveGoals();

    renderGoals();

}



function deleteGoal(id) {

    goals =
        goals.filter(
            goal => goal.id !== id
        );


    saveGoals();

    renderGoals();

}



/* =========================================
   POMODORO TIMER
========================================= */

let timerSeconds = 25 * 60;

let timerInterval = null;


function updateTimerDisplay() {

    const minutes =
        Math.floor(
            timerSeconds / 60
        );


    const seconds =
        timerSeconds % 60;


    document.getElementById(
        "timerDisplay"
    ).textContent =

        String(minutes)
            .padStart(2, "0")

        +

        ":"

        +

        String(seconds)
            .padStart(2, "0");

}



document.getElementById(
    "startTimer"
).addEventListener(
    "click",
    function() {

        if (timerInterval) return;


        timerInterval =
            setInterval(
                function() {

                    if (
                        timerSeconds > 0
                    ) {

                        timerSeconds--;

                        updateTimerDisplay();

                    }
                    else {

                        clearInterval(
                            timerInterval
                        );

                        timerInterval =
                            null;

                        alert(
                            "Pomodoro session completed! Take a short break."
                        );

                    }

                },
                1000
            );

    }
);



document.getElementById(
    "pauseTimer"
).addEventListener(
    "click",
    function() {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

    }
);



document.getElementById(
    "resetTimer"
).addEventListener(
    "click",
    function() {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

        timerSeconds =
            25 * 60;

        updateTimerDisplay();

    }
);



/* =========================================
   SMART RECOMMENDATION
========================================= */

function updateRecommendation() {

    if (tasks.length === 0) {

        recommendationText.textContent =
            "Add some study tasks to receive a recommendation.";

        return;

    }


    const pendingTasks =
        tasks.filter(
            task =>
                !task.completed
        );


    if (pendingTasks.length === 0) {

        recommendationText.textContent =
            "🎉 Great job! You have completed all your tasks.";

        return;

    }


    const highPriority =
        pendingTasks.filter(
            task =>
                task.priority === "High"
        );


    if (highPriority.length > 0) {

        recommendationText.textContent =
            "🧠 Recommendation: Start with your high-priority task — " +
            highPriority[0].title +
            ".";

        return;

    }


    pendingTasks.sort(
        (a, b) =>
            Number(a.progress) -
            Number(b.progress)
    );


    recommendationText.textContent =
        "🧠 Recommendation: Continue working on " +
        pendingTasks[0].title +
        " because it has the lowest progress.";

}



/* =========================================
   RENDER EVERYTHING
========================================= */

function renderAll() {

    renderTasks();

    updateStatistics();

    renderSubjectProgress();

    renderDailyPlanner();

    renderGoals();

    updateRecommendation();

    updateTimerDisplay();

    checkReminders();

    generateAdvancedRecommendations();

}


/* =========================================
   NOTIFICATIONS & REMINDERS
========================================= */

const enableNotificationsBtn =
    document.getElementById(
        "enableNotificationsBtn"
    );

const notificationStatus =
    document.getElementById(
        "notificationStatus"
    );

const reminderList =
    document.getElementById(
        "reminderList"
    );


/* Request notification permission */

enableNotificationsBtn.addEventListener(
    "click",
    async function() {

        if (!("Notification" in window)) {

            notificationStatus.textContent =
                "❌ Your browser does not support notifications.";

            return;
        }


        const permission =
            await Notification.requestPermission();


        if (permission === "granted") {

            notificationStatus.textContent =
                "✅ Notifications are enabled.";

            new Notification(
                "StudyMate 🔔",
                {
                    body:
                        "Study reminders are now enabled!"
                }
            );

            checkReminders();

        }
        else {

            notificationStatus.textContent =
                "❌ Notification permission was denied.";

        }

    }
);


/* Display notification status */

function updateNotificationStatus() {

    if (!("Notification" in window)) {

        notificationStatus.textContent =
            "Notifications are not supported.";

        return;
    }


    if (
        Notification.permission ===
        "granted"
    ) {

        notificationStatus.textContent =
            "✅ Notifications are enabled.";

    }
    else if (
        Notification.permission ===
        "denied"
    ) {

        notificationStatus.textContent =
            "❌ Notifications are blocked.";

    }
    else {

        notificationStatus.textContent =
            "Notifications are not enabled.";

    }

}


/* Check today's tasks */

function checkReminders() {

    reminderList.innerHTML = "";


    if (tasks.length === 0) {

        reminderList.innerHTML = `
            <p>No study tasks available.</p>
        `;

        return;
    }


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayTasks =
        tasks.filter(function(task) {

            return (
                task.date === today &&
                !task.completed
            );

        });


    if (todayTasks.length === 0) {

        reminderList.innerHTML = `
            <p>🎉 No pending tasks for today!</p>
        `;

        return;
    }


    todayTasks.forEach(function(task) {

        const item =
            document.createElement("div");

        item.className =
            "reminder-item";


        item.innerHTML = `
            <strong>
                📚 ${escapeHTML(task.title)}
            </strong>

            <p>
                Subject:
                ${escapeHTML(task.subject)}
            </p>

            <p>
                Priority:
                ${task.priority}
            </p>

            <p>
                Progress:
                ${task.progress}%
            </p>
        `;


        reminderList.appendChild(item);


        /* Send browser notification */

        if (
            "Notification" in window &&
            Notification.permission ===
            "granted"
        ) {

            const reminderKey =
                "reminded_" +
                task.id +
                "_" +
                today;


            if (
                !localStorage.getItem(
                    reminderKey
                )
            ) {

                new Notification(
                    "StudyMate Reminder 📚",
                    {
                        body:
                            task.title +
                            " is scheduled for today."
                    }
                );


                localStorage.setItem(
                    reminderKey,
                    "true"
                );

            }

        }

    });

}


/* Run reminder check every minute */

setInterval(
    checkReminders,
    60 * 1000
);


/* =========================================
   AUTOMATIC STUDY SCHEDULE
========================================= */

const generateScheduleBtn =
    document.getElementById(
        "generateScheduleBtn"
    );

const automaticSchedule =
    document.getElementById(
        "automaticSchedule"
    );


generateScheduleBtn.addEventListener(
    "click",
    generateAutomaticSchedule
);


function generateAutomaticSchedule() {

    automaticSchedule.innerHTML = "";


    const pendingTasks =
        tasks
            .filter(function(task) {

                return !task.completed;

            })
            .sort(function(a, b) {

                /* High priority first */

                const priorityOrder = {

                    High: 1,
                    Medium: 2,
                    Low: 3

                };


                const priorityDifference =
                    priorityOrder[a.priority] -
                    priorityOrder[b.priority];


                if (
                    priorityDifference !== 0
                ) {

                    return priorityDifference;

                }


                /* Lower progress first */

                return (
                    Number(a.progress) -
                    Number(b.progress)
                );

            });


    if (pendingTasks.length === 0) {

        automaticSchedule.innerHTML = `
            <div class="schedule-item">
                🎉 All tasks are completed!
            </div>
        `;

        return;
    }


    pendingTasks.forEach(
        function(task, index) {

            const studyNumber =
                index + 1;


            let recommendation;


            if (
                task.priority ===
                "High"
            ) {

                recommendation =
                    "Focus on this task first.";

            }
            else if (
                Number(task.progress) < 30
            ) {

                recommendation =
                    "Give this task extra study time.";

            }
            else {

                recommendation =
                    "Continue making steady progress.";

            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "schedule-item";


            item.innerHTML = `

                <h3>
                    📖 Study Session ${studyNumber}
                </h3>

                <p>
                    <strong>
                        Task:
                    </strong>

                    ${escapeHTML(
                        task.title
                    )}
                </p>

                <p>
                    📚 Subject:
                    ${escapeHTML(
                        task.subject
                    )}
                </p>

                <p>
                    📅 Date:
                    ${formatDate(
                        task.date
                    )}
                </p>

                <p>
                    ⚡ Priority:
                    ${task.priority}
                </p>

                <p>
                    📊 Progress:
                    ${task.progress}%
                </p>

                <p>
                    💡 ${recommendation}
                </p>

            `;


            automaticSchedule.appendChild(
                item
            );

        }
    );

}


/* =========================================
   ADVANCED STUDY RECOMMENDATIONS
========================================= */

const advancedRecommendation =
    document.getElementById(
        "advancedRecommendation"
    );


function generateAdvancedRecommendations() {

    if (tasks.length === 0) {

        advancedRecommendation.innerHTML =
            "Add some tasks to receive recommendations.";

        return;
    }


    const recommendations = [];


    const pendingTasks =
        tasks.filter(function(task) {

            return !task.completed;

        });


    if (pendingTasks.length === 0) {

        advancedRecommendation.innerHTML = `
            <div class="recommendation-item">
                🎉 Excellent! All your study tasks are completed.
            </div>
        `;

        return;
    }


    /* High priority recommendation */

    const highPriorityTask =
        pendingTasks.find(function(task) {

            return task.priority === "High";

        });


    if (highPriorityTask) {

        recommendations.push(`
            <div class="recommendation-item">

                <strong>
                    ⚡ High Priority
                </strong>

                <p>
                    Focus on
                    <b>
                        ${escapeHTML(
                            highPriorityTask.title
                        )}
                    </b>
                    because it has high priority.
                </p>

            </div>
        `);

    }


    /* Lowest progress */

    const lowestProgressTask =
        [...pendingTasks].sort(
            function(a, b) {

                return (
                    Number(a.progress) -
                    Number(b.progress)
                );

            }
        )[0];


    if (lowestProgressTask) {

        recommendations.push(`
            <div class="recommendation-item">

                <strong>
                    📊 Improve Your Progress
                </strong>

                <p>
                    Consider spending more time on
                    <b>
                        ${escapeHTML(
                            lowestProgressTask.title
                        )}
                    </b>
                    because its current progress is
                    ${lowestProgressTask.progress}%.
                </p>

            </div>
        `);

    }


    /* Due date recommendation */

    const sortedByDate =
        [...pendingTasks].sort(
            function(a, b) {

                return (
                    new Date(a.date) -
                    new Date(b.date)
                );

            }
        );


    const nearestTask =
        sortedByDate[0];


    if (nearestTask) {

        recommendations.push(`
            <div class="recommendation-item">

                <strong>
                    📅 Upcoming Task
                </strong>

                <p>
                    Your next scheduled task is
                    <b>
                        ${escapeHTML(
                            nearestTask.title
                        )}
                    </b>
                    on
                    ${formatDate(
                        nearestTask.date
                    )}.
                </p>

            </div>
        `);

    }


    /* Subject workload */

    const subjectCount = {};


    pendingTasks.forEach(
        function(task) {

            if (
                !subjectCount[
                    task.subject
                ]
            ) {

                subjectCount[
                    task.subject
                ] = 0;

            }


            subjectCount[
                task.subject
            ]++;

        }
    );


    let busiestSubject = null;

    let highestCount = 0;


    Object.keys(subjectCount)
        .forEach(
            function(subjectName) {

                if (
                    subjectCount[
                        subjectName
                    ] > highestCount
                ) {

                    highestCount =
                        subjectCount[
                            subjectName
                        ];

                    busiestSubject =
                        subjectName;

                }

            }
        );


    if (busiestSubject) {

        recommendations.push(`
            <div class="recommendation-item">

                <strong>
                    📚 Subject Focus
                </strong>

                <p>
                    You have
                    <b>
                        ${highestCount}
                    </b>
                    pending task(s) in
                    <b>
                        ${escapeHTML(
                            busiestSubject
                        )}
                    </b>.
                    Consider allocating additional
                    study time to this subject.
                </p>

            </div>
        `);

    }


    advancedRecommendation.innerHTML =
        recommendations.join("");

}

/* =========================================
   RENDER EVERYTHING
========================================= */

function renderAll() {

    renderTasks();

    updateStatistics();

    renderSubjectProgress();

    renderDailyPlanner();

    renderGoals();

    updateRecommendation();

    updateTimerDisplay();

    checkReminders();

    generateAdvancedRecommendations();

}


/* =========================================
   START APPLICATION
========================================= */

updateNotificationStatus();

renderAll();
