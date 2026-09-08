// ==========================
// AUTH CHECK
// ==========================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// ==========================
// GET MEMBER ID
// ==========================

const urlParams =
    new URLSearchParams(window.location.search);

const memberId =
    urlParams.get("id");


if (!memberId) {
    window.location.href = "team.html";
}


// ==========================
// ELEMENTS
// ==========================

const memberAvatar =
    document.getElementById("memberAvatar");

const memberName =
    document.getElementById("memberName");

const memberEmail =
    document.getElementById("memberEmail");

const memberRole =
    document.getElementById("memberRole");

const projectCount =
    document.getElementById("projectCount");

const taskCount =
    document.getElementById("taskCount");

const completedTaskCount =
    document.getElementById("completedTaskCount");

const pendingTaskCount =
    document.getElementById("pendingTaskCount");

const memberProjects =
    document.getElementById("memberProjects");

const memberTasks =
    document.getElementById("memberTasks");


// ==========================
// LOAD MEMBER DETAILS
// ==========================

async function loadMemberDetails() {

    try {

        // ==========================
        // GET USER
        // ==========================

        const userResponse =
            await fetch(
                `http://localhost:3000/users`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const userData =
            await userResponse.json();


        if (!userResponse.ok) {

            console.error(
                userData.message ||
                "Failed to load users"
            );

            return;
        }


        const users =
            userData.users || [];


        const member =
            users.find(
                user =>
                    user._id.toString() ===
                    memberId
            );


        if (!member) {

            memberName.textContent =
                "Member not found";

            return;
        }


        // ==========================
        // DISPLAY MEMBER
        // ==========================

        displayMember(member);


        // ==========================
        // GET PROJECTS
        // ==========================

        const projectResponse =
            await fetch(
                "http://localhost:3000/projects",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const projectData =
            await projectResponse.json();


        let projects = [];


        if (projectResponse.ok) {

            projects =
                projectData.projects || [];

        }


        // ==========================
        // MEMBER PROJECTS
        // ==========================

        const memberProjectList =
            projects.filter(project => {

                const ownerId =
                    project.owner?._id ||
                    project.owner;


                const isOwner =
                    ownerId &&
                    ownerId.toString() ===
                    memberId;


                const isMember =
                    project.members?.some(
                        projectMember => {

                            const projectMemberId =
                                projectMember?._id ||
                                projectMember;

                            return (
                                projectMemberId &&
                                projectMemberId.toString() ===
                                memberId
                            );

                        }
                    );


                return (
                    isOwner ||
                    isMember
                );

            });


        projectCount.textContent =
            memberProjectList.length;


        displayProjects(
            memberProjectList
        );


        // ==========================
        // GET MEMBER TASKS
        // ==========================

        let allTasks = [];


        for (
            const project of memberProjectList
        ) {

            const taskResponse =
                await fetch(
                    `http://localhost:3000/tasks/project/${project._id}`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );


            const taskData =
                await taskResponse.json();


            if (
                taskResponse.ok &&
                taskData.tasks
            ) {

                const assignedTasks =
                    taskData.tasks.filter(
                        task => {

                            const assignedId =
                                task.assignedTo?._id ||
                                task.assignedTo;

                            return (
                                assignedId &&
                                assignedId.toString() ===
                                memberId
                            );

                        }
                    );


                assignedTasks.forEach(
                    task => {

                        allTasks.push({
                            ...task,
                            projectName:
                                project.name
                        });

                    }
                );

            }

        }


        // ==========================
        // TASK STATISTICS
        // ==========================

        taskCount.textContent =
            allTasks.length;


        const completedTasks =
            allTasks.filter(
                task =>
                    task.status === "completed"
            );


        completedTaskCount.textContent =
            completedTasks.length;


        const pendingTasks =
            allTasks.filter(
                task =>
                    task.status !== "completed"
            );


        pendingTaskCount.textContent =
            pendingTasks.length;


        // ==========================
        // DISPLAY TASKS
        // ==========================

        displayTasks(allTasks);


    } catch (error) {

        console.error(
            "Member Details Error:",
            error
        );

    }

}


// ==========================
// DISPLAY MEMBER
// ==========================

function displayMember(member) {

    memberName.textContent =
        member.name;


    memberEmail.textContent =
        member.email;


    memberRole.textContent =
        member.role;


    memberRole.className =
        `member-role ${member.role}`;


    // ==========================
    // INITIALS
    // ==========================

    const initials =
        member.name
            ? member.name
                .split(" ")
                .map(word => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()
            : "U";


    memberAvatar.textContent =
        initials;

}


// ==========================
// DISPLAY PROJECTS
// ==========================

function displayProjects(projects) {

    memberProjects.innerHTML = "";


    if (projects.length === 0) {

        memberProjects.innerHTML = `
            <div class="empty-state">
                <p>
                    This member is not part of any project.
                </p>
            </div>
        `;

        return;
    }


    projects.forEach(project => {

        const projectCard =
            document.createElement("div");


        projectCard.className =
            "member-project-card";


        projectCard.innerHTML = `

            <div class="project-info">

                <h3>
                    ${project.name}
                </h3>

                <p>
                    ${project.description || "No description"}
                </p>

            </div>


            <div class="project-meta">

                <span class="project-status ${project.status}">
                    ${project.status}
                </span>

                <span class="project-priority ${project.priority}">
                    ${project.priority}
                </span>

            </div>

        `;


        memberProjects.appendChild(
            projectCard
        );

    });

}


// ==========================
// DISPLAY TASKS
// ==========================

function displayTasks(tasks) {

    memberTasks.innerHTML = "";


    if (tasks.length === 0) {

        memberTasks.innerHTML = `
            <div class="empty-state">
                <p>
                    No tasks assigned to this member.
                </p>
            </div>
        `;

        return;
    }


    tasks.forEach(task => {

        const taskCard =
            document.createElement("div");


        taskCard.className =
            "member-task-card";


        taskCard.innerHTML = `

            <div class="task-info">

                <h3>
                    ${task.title}
                </h3>

                <p>
                    ${task.description || "No description"}
                </p>

                <small>
                    Project:
                    ${task.projectName}
                </small>

            </div>


            <div class="task-meta">

                <span class="task-status ${task.status}">
                    ${task.status}
                </span>

                <span class="task-priority ${task.priority}">
                    ${task.priority}
                </span>

                <span class="task-deadline">
                    Due:
                    ${new Date(
                        task.deadline
                    ).toLocaleDateString()}
                </span>

            </div>

        `;


        memberTasks.appendChild(
            taskCard
        );

    });

}


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
// DARK MODE
// ==========================

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


const darkMode =
    localStorage.getItem(
        "darkMode"
    );


if (darkMode === "enabled") {

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
// INITIAL LOAD
// ==========================

loadMemberDetails();