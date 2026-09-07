// ==========================
// AUTH CHECK
// ==========================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// ==========================
// ELEMENTS
// ==========================

const totalMembers =
    document.getElementById("totalMembers");

const managerCount =
    document.getElementById("managerCount");

const memberCount =
    document.getElementById("memberCount");

const searchInput =
    document.getElementById("searchInput");

const roleFilter =
    document.getElementById("roleFilter");

const teamContainer =
    document.getElementById("teamContainer");


// ==========================
// DATA
// ==========================

let allUsers = [];

let allProjects = [];


// ==========================
// LOAD TEAM
// ==========================

async function loadTeam() {

    try {

        // ==========================
        // GET USERS
        // ==========================

        const userResponse =
            await fetch(
                "http://localhost:3000/users",
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

            teamContainer.innerHTML = `
                <div class="empty-state">
                    <p>
                        ${userData.message || "Failed to load team members"}
                    </p>
                </div>
            `;

            return;
        }


        allUsers =
            userData.users || [];


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


        if (projectResponse.ok) {

            allProjects =
                projectData.projects || [];

        }


        // ==========================
        // UPDATE STATISTICS
        // ==========================

        updateStatistics();


        // ==========================
        // DISPLAY TEAM
        // ==========================

        displayTeam(allUsers);


    } catch (error) {

        console.error(
            "Team Error:",
            error
        );

        teamContainer.innerHTML = `
            <div class="empty-state">
                <p>
                    Unable to load team members
                </p>
            </div>
        `;

    }

}


// ==========================
// UPDATE STATISTICS
// ==========================

function updateStatistics() {

    const managers =
        allUsers.filter(
            user => user.role === "manager"
        );


    const members =
        allUsers.filter(
            user => user.role === "member"
        );


    totalMembers.textContent =
        allUsers.length;


    managerCount.textContent =
        managers.length;


    memberCount.textContent =
        members.length;

}


// ==========================
// COUNT USER PROJECTS
// ==========================

function getUserProjectCount(userId) {

    let count = 0;


    allProjects.forEach(project => {

        // ==========================
        // PROJECT OWNER
        // ==========================

        const ownerId =
            project.owner?._id ||
            project.owner;


        if (
            ownerId &&
            ownerId.toString() ===
            userId.toString()
        ) {

            count++;

            return;

        }


        // ==========================
        // PROJECT MEMBER
        // ==========================

        const isMember =
            project.members?.some(member => {

                const memberId =
                    member?._id ||
                    member;


                return (
                    memberId &&
                    memberId.toString() ===
                    userId.toString()
                );

            });


        if (isMember) {

            count++;

        }

    });


    return count;

}


// ==========================
// DISPLAY TEAM
// ==========================

function displayTeam(users) {

    teamContainer.innerHTML = "";


    if (users.length === 0) {

        teamContainer.innerHTML = `
            <div class="empty-state">
                <p>
                    No team members found
                </p>
            </div>
        `;

        return;
    }


    users.forEach(user => {

        // ==========================
        // PROJECT COUNT
        // ==========================

        const projectCount =
            getUserProjectCount(
                user._id
            );


        // ==========================
        // INITIALS
        // ==========================

        const initials =
            user.name
                ? user.name
                    .split(" ")
                    .map(word => word[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "U";


        // ==========================
        // CREATE CARD
        // ==========================

        const card =
            document.createElement("div");


        card.className =
            "team-member-card";


        card.innerHTML = `

            <div class="member-avatar">
                ${initials}
            </div>


            <div class="member-info">

                <h3>
                    ${user.name}
                </h3>

                <p>
                    ${user.email}
                </p>

            </div>


            <div class="member-details">

                <span class="member-role ${user.role}">
                    ${user.role}
                </span>


                <span class="member-projects">

                    ${projectCount}

                    ${
                        projectCount === 1
                            ? "Project"
                            : "Projects"
                    }

                </span>

            </div>

        `;


        teamContainer.appendChild(
            card
        );

    });

}


// ==========================
// SEARCH
// ==========================

searchInput.addEventListener(
    "input",
    () => {

        filterTeam();

    }
);


// ==========================
// ROLE FILTER
// ==========================

roleFilter.addEventListener(
    "change",
    () => {

        filterTeam();

    }
);


// ==========================
// FILTER TEAM
// ==========================

function filterTeam() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedRole =
        roleFilter.value;


    const filteredUsers =
        allUsers.filter(user => {

            const userName =
                user.name
                    ? user.name.toLowerCase()
                    : "";


            const userEmail =
                user.email
                    ? user.email.toLowerCase()
                    : "";


            const matchesSearch =
                userName.includes(searchTerm) ||
                userEmail.includes(searchTerm);


            const matchesRole =
                selectedRole === "all" ||
                user.role === selectedRole;


            return (
                matchesSearch &&
                matchesRole
            );

        });


    displayTeam(
        filteredUsers
    );

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

loadTeam();