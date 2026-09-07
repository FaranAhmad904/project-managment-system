// ==========================
// AUTH CHECK
// ==========================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// ==========================
// GET USER INFORMATION
// ==========================

const userData = localStorage.getItem("user");

let user = null;

if (userData) {
    user = JSON.parse(userData);
}


// ==========================
// WELCOME MESSAGE
// ==========================

const welcomeMessage = document.getElementById("welcomeMessage");

if (user) {
    welcomeMessage.textContent =
        `Welcome back, ${user.name} (${user.role})`;
}


// ==========================
// LOGOUT
// ==========================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
});





//dashboard Elements
const projectsCount =
    document.getElementById("projectsCount");

const tasksCount =
    document.getElementById("tasksCount");

const teamMembersCount =
    document.getElementById("teamMembersCount");

const completedTasksCount =
    document.getElementById("completedTasksCount");

const recentActivity =
    document.getElementById("recentActivity");



async function loadDashboard(){

    try
    {

        const projectResponse = await fetch(  "http://localhost:3000/projects",{

            method:"GET",
            
            headers:{
                 "Authorization":
                  `Bearer ${token}`
            }
        });

        const projectData = await projectResponse.json();

        if(!projectResponse.ok)
        {
            console.log("Failed to load response");
        }


        const projects = projectData.projects || [];

        projectsCount.textContent=projects.length;

//load tasks
        let allTasks = [];


        for(const project of projects)
        {
            const taskResponse = 
            await fetch(`http://localhost:3000/tasks/project/${project._id}`,
                {
                    method:"GET",

                    headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }

                }
            );

            const taskData = await taskResponse.json();

            if(taskResponse.ok && taskData.tasks)
            {
                taskData.tasks.forEach(task => {

                    allTasks.push({
                        ...task,
                        projectName:
                            project.name
                    });

                });
            }
        }

        tasksCount.textContent=allTasks.length;

        const completedTasks = allTasks.filter(
            task=>task.status.completed
        )
         completedTasksCount.textContent =
            completedTasks.length;




    //team members count


    const memberIds = new Set();

    projects.forEach(project=>{
        if(project.owner)
        {
            const ownerId = project.owner._id || project.owner

            memberIds.add(ownerId);
        }
        if(project.members && project.members.length > 0)
        {
            project.members.forEach(member =>{
                const memberId =  member._id ||
                        member;
    
        memberIds.add(memberId)
            })
        }
    })

     teamMembersCount.textContent =
            memberIds.size;
        

      displayRecentActivity(
            projects,
            allTasks
        );

    }catch(error)
    {
        console.error(error)
    }
}


function displayRecentActivity(
    projects,
    tasks
)
{
    recentActivity.innerHTML = "";


    const activities = [];


    projects.forEach(project=>{
        activities.push({
            type:"Project",

            title: project.name,

            date:project.createdAt
        })

    })

    tasks.forEach(task => {

        activities.push({

            type: "Task",

            title:
                task.title,

            date:
                task.createdAt,

            projectName:
                task.projectName

        });

    });

    activities.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );



    // Show only latest 5

    const latestActivities =
        activities.slice(0, 5);


    if (
        latestActivities.length === 0
    ) {

        recentActivity.innerHTML = `
            <div class="empty-state">
                <p>No recent activity</p>
            </div>
        `;

        return;
    }


    latestActivities.forEach(activity => {

        const activityItem =
            document.createElement("div");


        activityItem.className =
            "activity-item";


        const formattedDate =
            new Date(
                activity.date
            ).toLocaleDateString();


        activityItem.innerHTML = `

            <div class="activity-info">

                <strong>
                    ${activity.type}
                </strong>

                <p>
                    ${activity.title}
                </p>

                ${
                    activity.projectName
                        ? `
                            <small>
                                Project:
                                ${activity.projectName}
                            </small>
                        `
                        : ""
                }

            </div>

            <span class="activity-date">
                ${formattedDate}
            </span>

        `;


        recentActivity.appendChild(
            activityItem
        );

    });


    const createProjectBtn =
    document.querySelector(
        ".action-btn:nth-child(1)"
    );

const createTaskBtn =
    document.querySelector(
        ".action-btn:nth-child(2)"
    );


    createProjectBtn.addEventListener("click",()=>{
        window.location.href="projects.html"
    })

    createTaskBtn.addEventListener("click",()=>{
        window.location.href="tasks.html"
    })


}


// ==========================
// DARK MODE
// ==========================

const themeToggle = document.getElementById("themeToggle");

const darkMode = localStorage.getItem("darkMode");

if (darkMode === "enabled") {

    document.body.classList.add("dark-mode");

    themeToggle.textContent = "Light Mode";
}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("darkMode", "enabled");

        themeToggle.textContent = "Light Mode";

    } else {

        localStorage.setItem("darkMode", "disabled");

        themeToggle.textContent = "Dark Mode";
    }
});



loadDashboard();