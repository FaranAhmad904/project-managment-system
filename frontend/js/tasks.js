const token = localStorage.getItem("token")

if(!token)
{
    window.location.href="login.html"
}

const tasksContainer = document.getElementById("tasksContainer");


async function loadAllTasks()
{
    try
    {
        const projectResponse = await fetch("http://localhost:3000/projects",
            {
                  headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
            }
        );

        const projectData = await projectResponse.json();
          if (!projectResponse.ok) {

            tasksContainer.innerHTML = `
                <div class="empty-projects">
                    <h3>Unable to load projects</h3>
                    <p>
                        ${
                            projectData.message ||
                            "Something went wrong"
                        }
                    </p>
                </div>
            `;

            return;
        }

         const projects =
            projectData.projects || [];


        let allTasks = [];


        for (const project of projects)
        {
              const taskResponse =
                await fetch(
                    `http://localhost:3000/tasks/project/${project._id}`,
                    {
                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );

                const taskData = await taskResponse.json();

                if(taskResponse.ok && taskData.tasks)
                {
                    taskData.tasks.forEach(task=>{

                        allTasks.push({
                            ...task,
                            projectName:
                            project.name
                        })

                    })
                }
        } displayTasks(allTasks);
    }catch(error)
    {

        console.error(
            "Error loading tasks:",
            error
        );

        tasksContainer.innerHTML = `
            <div class="empty-projects">
                <h3>Unable to load tasks</h3>
                <p>
                    Something went wrong while loading tasks.
                </p>
            </div>
        `;

    }
}

function displayTasks(tasks)
{
    tasksContainer.innerHTML="";

    if(tasks.length===0)
    {
         tasksContainer.innerHTML = `
            <div class="empty-projects">

                <h3>
                    No tasks found
                </h3>

                <p>
                    Create tasks inside your projects.
                </p>

            </div>
        `;

        return;
    }

    tasks.forEach(task => {

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
                    Project:
                    ${task.projectName}
                </span>

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


                <span>
                    Status:
                    ${task.status}
                </span>


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

}



const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("darkMode");

if(savedTheme==="enabled")
{
    document.body.classList.add("dark-mode");

     themeToggle.textContent =
        "Light Mode";

}

themeToggle.addEventListener("click",async()=>{

    document.body.classList.toggle("dark-mode");

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
        }
        else {

            localStorage.setItem(
                "darkMode",
                "disabled"
            );

            themeToggle.textContent =
                "Dark Mode";

        }
})


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


loadAllTasks();