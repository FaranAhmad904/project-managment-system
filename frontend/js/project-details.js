// ==========================
// AUTH CHECK
// ==========================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// ==========================
// GET PROJECT ID
// ==========================

const urlParams =
    new URLSearchParams(window.location.search);

const projectId =
    urlParams.get("id");

console.log("Project ID:", projectId);


// ==========================
// ELEMENTS
// ==========================

// PROJECT MEMBERS

const addMemberBtn =
    document.getElementById("addMemberBtn");

const addMemberForm =
    document.getElementById("addMemberForm");

const cancelMemberBtn =
    document.getElementById("cancelMemberBtn");

const saveMemberBtn =
    document.getElementById("saveMemberBtn");

const memberSelect =
    document.getElementById("memberSelect");

const membersContainer =
    document.getElementById("membersContainer");

const memberMessage =
    document.getElementById("memberMessage");


// TASKS

const addTaskBtn =
    document.getElementById("addTaskBtn");

const addTaskForm =
    document.getElementById("addTaskForm");

const cancelTaskBtn =
    document.getElementById("cancelTaskBtn");

const saveTaskBtn =
    document.getElementById("saveTaskBtn");

const taskTitle =
    document.getElementById("taskTitle");

const taskDescription =
    document.getElementById("taskDescription");

const taskPriority =
    document.getElementById("taskPriority");

const taskDeadline =
    document.getElementById("taskDeadline");

const taskAssignee =
    document.getElementById("taskAssignee");

const taskMessage =
    document.getElementById("taskMessage");

const tasksContainer =
    document.getElementById("tasksContainer");


// ==========================
// HIDE FORMS
// ==========================

addMemberForm.style.display = "none";
addTaskForm.style.display = "none";


// ==========================
// ADD MEMBER FORM
// ==========================

addMemberBtn.addEventListener("click", async () => {

    addMemberForm.style.display = "block";

    memberMessage.textContent = "";

    await loadUsers();

});


cancelMemberBtn.addEventListener("click", () => {

    addMemberForm.style.display = "none";

    memberSelect.value = "";

    memberMessage.textContent = "";

});


// ==========================
// LOAD ALL USERS
// ==========================

async function loadUsers() {

    try {

        const response = await fetch(
            "http://localhost:3000/users",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        console.log(
            "Users:",
            data
        );


        if (!response.ok) {

            memberMessage.textContent =
                data.message ||
                "Failed to load users";

            return;
        }


        memberSelect.innerHTML = `
            <option value="">
                Select a member
            </option>
        `;


        data.users.forEach(user => {

            const option =
                document.createElement("option");

            option.value =
                user._id;

            option.textContent =
                `${user.name} (${user.email})`;

            memberSelect.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Error loading users:",
            error
        );

        memberMessage.textContent =
            "Unable to load users.";

    }

}


// ==========================
// LOAD PROJECT
// ==========================

async function loadProject() {

    if (!projectId) {

        console.log(
            "No project ID found"
        );

        return;
    }


    try {

        const response = await fetch(
            `http://localhost:3000/projects/${projectId}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        console.log(
            "Project data:",
            data
        );


        if (!response.ok) {

            console.error(
                data.message ||
                "Failed to load project"
            );

            return;
        }


        displayProject(
            data.project
        );


    } catch (error) {

        console.error(
            "Error loading project:",
            error
        );

    }

}


// ==========================
// DISPLAY PROJECT
// ==========================

function displayProject(project) {

    const projectDetailsContainer =
        document.getElementById(
            "projectDetailsContainer"
        );


    const startDate =
        new Date(project.startDate)
            .toLocaleDateString();


    const deadline =
        new Date(project.deadline)
            .toLocaleDateString();


    projectDetailsContainer.innerHTML = `

        <div class="project-details-card">

            <div class="project-details-header">

                <div>

                    <h2>
                        ${project.name}
                    </h2>

                    <p>
                        ${
                            project.description ||
                            "No description provided"
                        }
                    </p>

                </div>


                <span
                    class="status-badge status-${project.status}"
                >
                    ${project.status}
                </span>

            </div>


            <div class="project-details-info">

                <div class="detail-item">

                    <span>
                        Priority
                    </span>

                    <strong
                        class="priority-badge priority-${project.priority}"
                    >
                        ${project.priority}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Start Date
                    </span>

                    <strong>
                        ${startDate}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Deadline
                    </span>

                    <strong>
                        ${deadline}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Members
                    </span>

                    <strong>
                        ${
                            project.members
                                ? project.members.length
                                : 0
                        }
                    </strong>

                </div>

            </div>

        </div>

    `;

}


// ==========================
// ADD PROJECT MEMBER
// ==========================

saveMemberBtn.addEventListener(
    "click",
    async () => {

        const userId =
            memberSelect.value;


        if (!userId) {

            memberMessage.textContent =
                "Please select a member";

            return;
        }


        try {

            const response =
                await fetch(
                    `http://localhost:3000/projects/${projectId}/members`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            userId: userId
                        })
                    }
                );


            const data =
                await response.json();


            console.log(
                "Add member response:",
                data
            );


            if (!response.ok) {

                memberMessage.textContent =
                    data.message ||
                    "Failed to add member";

                return;
            }


            memberMessage.textContent =
                "Member added successfully";


            memberSelect.value = "";

            addMemberForm.style.display =
                "none";


            await loadMembers();


        } catch (error) {

            console.error(
                "Error adding member:",
                error
            );

            memberMessage.textContent =
                "Unable to add member";

        }

    }
);


// ==========================
// LOAD PROJECT MEMBERS
// ==========================

async function loadMembers() {

    try {

        const response =
            await fetch(
                `http://localhost:3000/projects/${projectId}/members`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Project members:",
            data
        );


        if (!response.ok) {

            membersContainer.innerHTML = `

                <div class="empty-projects">

                    <h3>
                        Unable to load members
                    </h3>

                    <p>
                        ${
                            data.message ||
                            "Something went wrong"
                        }
                    </p>

                </div>

            `;

            return;
        }


        membersContainer.innerHTML = "";


        // ==========================
        // OWNER
        // ==========================

        if (data.owner) {

            const ownerCard =
                document.createElement("div");


            ownerCard.className =
                "member-card";


            ownerCard.innerHTML = `

                <div class="member-info">

                    <div class="member-avatar">
                        ${
                            data.owner.name
                                .charAt(0)
                                .toUpperCase()
                        }
                    </div>


                    <div>

                        <h3>
                            ${data.owner.name}
                        </h3>

                        <p>
                            ${data.owner.email}
                        </p>

                    </div>

                </div>


                <span class="member-role">
                    Owner
                </span>

            `;


            membersContainer.appendChild(
                ownerCard
            );

        }


        // ==========================
        // PROJECT MEMBERS
        // ==========================

        if (
            data.members &&
            data.members.length > 0
        ) {

            data.members.forEach(member => {

                const memberCard =
                    document.createElement("div");


                memberCard.className =
                    "member-card";


                memberCard.innerHTML = `

                    <div class="member-info">

                        <div class="member-avatar">
                            ${
                                member.name
                                    .charAt(0)
                                    .toUpperCase()
                            }
                        </div>


                        <div>

                            <h3>
                                ${member.name}
                            </h3>

                            <p>
                                ${member.email}
                            </p>

                        </div>

                    </div>


                    <button
                        class="remove-member-btn"
                        onclick="removeMember('${member._id}')"
                    >
                        Remove
                    </button>

                `;


                membersContainer.appendChild(
                    memberCard
                );

            });

        }

    } catch (error) {

        console.error(
            "Error loading project members:",
            error
        );

    }

}


// ==========================
// REMOVE PROJECT MEMBER
// ==========================

async function removeMember(userId) {

    const confirmed =
        confirm(
            "Are you sure you want to remove this member?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:3000/projects/${projectId}/members/${userId}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Remove member response:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to remove member"
            );

            return;
        }


        alert(
            "Member removed successfully"
        );


        await loadMembers();


    } catch (error) {

        console.error(
            "Error removing member:",
            error
        );

        alert(
            "Unable to remove member"
        );

    }

}


// ==========================
// ADD TASK FORM
// ==========================

addTaskBtn.addEventListener(
    "click",
    async () => {

        addTaskForm.style.display =
            "block";

        taskMessage.textContent = "";

        await loadTaskMembers();

    }
);


// ==========================
// CANCEL TASK
// ==========================

cancelTaskBtn.addEventListener(
    "click",
    () => {

        addTaskForm.style.display =
            "none";

        taskTitle.value = "";

        taskDescription.value = "";

        taskPriority.value =
            "medium";

        taskDeadline.value = "";

        taskAssignee.value = "";

        taskMessage.textContent = "";

    }
);


// ==========================
// LOAD PROJECT MEMBERS
// FOR TASK ASSIGNMENT
// ==========================

async function loadTaskMembers() {

    try {

        const response =
            await fetch(
                `http://localhost:3000/projects/${projectId}/members`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            taskMessage.textContent =
                data.message ||
                "Failed to load members";

            return;
        }


        taskAssignee.innerHTML = `
            <option value="">
                Select member
            </option>
        `;


        // OWNER

        if (data.owner) {

            const option =
                document.createElement("option");


            option.value =
                data.owner._id;


            option.textContent =
                `${data.owner.name} (Owner)`;


            taskAssignee.appendChild(
                option
            );

        }


        // MEMBERS

        if (
            data.members &&
            data.members.length > 0
        ) {

            data.members.forEach(member => {

                const option =
                    document.createElement("option");


                option.value =
                    member._id;


                option.textContent =
                    member.name;


                taskAssignee.appendChild(
                    option
                );

            });

        }

    } catch (error) {

        console.error(
            "Error loading task members:",
            error
        );

        taskMessage.textContent =
            "Unable to load project members";

    }

}


// ==========================
// CREATE TASK
// ==========================

saveTaskBtn.addEventListener(
    "click",
    async () => {

        const title =
            taskTitle.value.trim();


        const description =
            taskDescription.value.trim();


        const priority =
            taskPriority.value;


        const deadline =
            taskDeadline.value;


        const assignedTo =
            taskAssignee.value;


        // ==========================
        // VALIDATION
        // ==========================

        if (!title) {

            taskMessage.textContent =
                "Please enter a task title";

            return;
        }


        if (!deadline) {

            taskMessage.textContent =
                "Please select a deadline";

            return;
        }


        try {

            const response =
                await fetch(
                    "http://localhost:3000/tasks",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            title,

                            description,

                            priority,

                            deadline,

                            project:
                                projectId,

                            assignedTo:
                                assignedTo || null

                        })
                    }
                );


            const data =
                await response.json();


            console.log(
                "Create task response:",
                data
            );


            if (!response.ok) {

                taskMessage.textContent =
                    data.message ||
                    "Failed to create task";

                return;
            }


            taskTitle.value = "";

            taskDescription.value = "";

            taskPriority.value =
                "medium";

            taskDeadline.value = "";

            taskAssignee.value = "";


            addTaskForm.style.display =
                "none";


            await loadTasks();


        } catch (error) {

            console.error(
                "Error creating task:",
                error
            );

            taskMessage.textContent =
                "Unable to create task";

        }

    }
);


// ==========================
// LOAD PROJECT TASKS
// ==========================

async function loadTasks() {

    try {

        const response =
            await fetch(
                `http://localhost:3000/tasks/project/${projectId}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Project tasks:",
            data
        );


        if (!response.ok) {

            tasksContainer.innerHTML = `

                <div class="empty-projects">

                    <h3>
                        Unable to load tasks
                    </h3>

                    <p>
                        ${
                            data.message ||
                            "Something went wrong"
                        }
                    </p>

                </div>

            `;

            return;
        }


        tasksContainer.innerHTML = "";


        if (
            !data.tasks ||
            data.tasks.length === 0
        ) {

            tasksContainer.innerHTML = `

                <div class="empty-projects">

                    <h3>
                        No tasks yet
                    </h3>

                    <p>
                        Create tasks for this project.
                    </p>

                </div>

            `;


            updateProgress([]);

            return;
        }


        data.tasks.forEach(task => {

            const taskCard =
                document.createElement("div");


            taskCard.className =
                "task-card";


            const assignedUser =
                task.assignedTo
                    ? task.assignedTo.name
                    : "Unassigned";


            taskCard.innerHTML = `

                <div class="task-info">

                    <h3>
                        ${task.title}
                    </h3>


                    <p>
                        ${
                            task.description ||
                            "No description"
                        }
                    </p>


                    <span>
                        Assigned to:
                        ${assignedUser}
                    </span>

                </div>


                <div class="task-meta">

                    <span
                        class="task-priority ${task.priority}"
                    >
                        ${task.priority}
                    </span>


                    <select
                        class="task-status-select"
                        onchange="updateTaskStatus(
                            '${task._id}',
                            this.value
                        )"
                    >

                        <option
                            value="todo"
                            ${
                                task.status === "todo"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Todo
                        </option>


                        <option
                            value="in-progress"
                            ${
                                task.status === "in-progress"
                                    ? "selected"
                                    : ""
                            }
                        >
                            In Progress
                        </option>


                        <option
                            value="completed"
                            ${
                                task.status === "completed"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Completed
                        </option>

                    </select>


                    <span>
                        Due:
                        ${
                            new Date(
                                task.deadline
                            ).toLocaleDateString()
                        }
                    </span>

                </div>

            `;


            tasksContainer.appendChild(
                taskCard
            );

        });


        updateProgress(
            data.tasks
        );


    } catch (error) {

        console.error(
            "Error loading tasks:",
            error
        );

    }

}


// ==========================
// UPDATE TASK STATUS
// ==========================

async function updateTaskStatus(
    taskId,
    status
) {

    try {

        const response =
            await fetch(
                `http://localhost:3000/tasks/${taskId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Update task:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to update task"
            );

            return;
        }


        await loadTasks();


    } catch (error) {

        console.error(
            "Error updating task status:",
            error
        );

        alert(
            "Unable to update task"
        );

    }

}


// ==========================
// UPDATE PROJECT PROGRESS
// ==========================

function updateProgress(tasks) {

    const totalTasks =
        tasks.length;


    const completedTasks =
        tasks.filter(
            task =>
                task.status === "completed"
        ).length;


    let percentage = 0;


    if (totalTasks > 0) {

        percentage =
            Math.round(
                (completedTasks /
                    totalTasks) * 100
            );

    }


    document.getElementById(
        "progressPercentage"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "progressFill"
    ).style.width =
        `${percentage}%`;


    document.getElementById(
        "progressText"
    ).textContent =
        `${completedTasks} of ${totalTasks} tasks completed`;

}


// ==========================
// DARK MODE
// ==========================

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


const savedTheme =
    localStorage.getItem(
        "darkMode"
    );


if (savedTheme === "enabled") {

    document.body.classList.add(
        "dark-mode"
    );

    themeToggle.textContent =
        "Light Mode";

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            localStorage.setItem(
                "darkMode",
                "enabled"
            );

            themeToggle.textContent =
                "Light Mode";

        } else {

            localStorage.setItem(
                "darkMode",
                "disabled"
            );

            themeToggle.textContent =
                "Dark Mode";

        }

    }
);


// ==========================
// LOGOUT
// ==========================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "login.html";

    }
);


// ==========================
// INITIAL LOAD
// ==========================

loadProject();

loadMembers();

loadTasks();