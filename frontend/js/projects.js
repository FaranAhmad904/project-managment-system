// ==========================
// AUTH CHECK
// ==========================
let editingProjectId = null;
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// ==========================
// ELEMENTS
// ==========================

const themeToggle = document.getElementById("themeToggle");
const logoutBtn = document.getElementById("logoutBtn");

const createProjectBtn =
    document.getElementById("createProjectBtn");

const emptyCreateBtn =
    document.getElementById("emptyCreateBtn");

const closeFormBtn =
    document.getElementById("closeFormBtn");

const cancelProjectBtn =
    document.getElementById("cancelProjectBtn");

const projectFormSection =
    document.getElementById("projectFormSection");

const projectForm =
    document.getElementById("projectForm");

const projectMessage =
    document.getElementById("projectMessage");

const projectsContainer =
    document.getElementById("projectsContainer");


// ==========================
// DARK MODE
// ==========================

const savedTheme = localStorage.getItem("darkMode");

if (savedTheme === "enabled") {

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


// ==========================
// LOGOUT
// ==========================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
});


// ==========================
// OPEN PROJECT FORM
// ==========================

function openProjectForm() {

    projectFormSection.classList.add("show");

    projectMessage.textContent = "";

    document.getElementById("projectName").focus();
}


// ==========================
// CLOSE PROJECT FORM
// ==========================

function closeProjectForm() {

    projectFormSection.classList.remove("show");

    projectForm.reset();

    projectMessage.textContent = "";

    editingProjectId = null;

    document.querySelector(".form-header h2").textContent =
        "Create Project";

    document.querySelector(".form-header p").textContent =
        "Enter the details of your new project";

    document.querySelector(".save-project-btn").textContent =
        "Create Project";
}


// ==========================
// CREATE PROJECT BUTTON
// ==========================

createProjectBtn.addEventListener("click", () => {

    openProjectForm();

});


// ==========================
// EMPTY CREATE BUTTON
// ==========================

emptyCreateBtn.addEventListener("click", () => {

    openProjectForm();

});


// ==========================
// CLOSE BUTTON
// ==========================

closeFormBtn.addEventListener("click", () => {

    closeProjectForm();

});


// ==========================
// CANCEL BUTTON
// ==========================

cancelProjectBtn.addEventListener("click", () => {

    closeProjectForm();

});


// ==========================
// CREATE PROJECT
// ==========================

projectForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Get form values

    const name =
        document.getElementById("projectName").value.trim();

    const description =
        document.getElementById("projectDescription").value.trim();

    const startDate =
        document.getElementById("startDate").value;

    const deadline =
        document.getElementById("deadline").value;

    const priority =
        document.getElementById("projectPriority").value;

    const status =
    document.getElementById("projectStatus").value;


    // ==========================
    // VALIDATION
    // ==========================

    if (!name || !startDate || !deadline) {

        projectMessage.textContent =
            "Please fill in all required fields.";

        return;
    }


    if (new Date(deadline) < new Date(startDate)) {

        projectMessage.textContent =
            "Deadline cannot be before start date.";

        return;
    }


    // ==========================
    // SEND REQUEST
    // ==========================

    try {

       const url = editingProjectId
    ? `http://localhost:3000/projects/${editingProjectId}`
    : "http://localhost:3000/projects";

const method = editingProjectId
    ? "PUT"
    : "POST";


const response = await fetch(
    url,
    {
        method: method,

        headers: {
            "Content-Type": "application/json",

            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            name,
            description,
            startDate,
            deadline,
            priority,
            status
        })
    }
);
        const data = await response.json();


        // ==========================
        // ERROR
        // ==========================

        if (!response.ok) {

            projectMessage.textContent =
                data.message || "Failed to create project.";

            return;
        }


        // ==========================
        // SUCCESS
        // ==========================

        projectMessage.textContent =
            editingProjectId
        ? "Project updated successfully."
        : "Project created successfully.";


        projectForm.reset();
        
        editingProjectId = null;

document.querySelector(".form-header h2").textContent =
    "Create Project";

document.querySelector(".save-project-btn").textContent =
    "Create Project";


        // Reload projects

        await loadProjects();


        // Close form

        setTimeout(() => {

            projectFormSection.classList.remove("show");

            projectMessage.textContent = "";

        }, 500);


    } catch (error) {

        console.error("Create project error:", error);

        projectMessage.textContent =
            "Unable to connect to server.";
    }

});


// ==========================
// LOAD PROJECTS
// ==========================

async function loadProjects() {

    try {

        const response = await fetch(
            "http://localhost:3000/projects",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            projectsContainer.innerHTML = `
                <div class="empty-projects">

                    <h3>Unable to load projects</h3>

                    <p>
                        ${data.message || "Something went wrong."}
                    </p>

                </div>
            `;

            return;
        }


        displayProjects(data.projects);


    } catch (error) {

        console.error("Load projects error:", error);

        projectsContainer.innerHTML = `
            <div class="empty-projects">

                <h3>Server Error</h3>

                <p>
                    Unable to connect to server.
                </p>

            </div>
        `;
    }
}


// ==========================
// DISPLAY PROJECTS
// ==========================

function displayProjects(projects)
{
    if(!projects || projects.length===0)
    {
        projectsContainer.innerHTML = `
        <div class="empty-projects">

                <h3>No projects yet</h3>

                <p>
                    Create your first project to get started.
                </p>

                <button
                    type="button"
                    id="emptyCreateBtn"
                >
                    Create Project
                </button>

            </div>
        `;
        document.getElementById("emptyCreateBtn").addEventListener("click",openProjectForm);

        return;
    }

    projectsContainer.innerHTML = projects.map((project)=>{

        const startDate =new Date(project.startDate).toLocaleDateString();
          const deadline =
            new Date(project.deadline).toLocaleDateString();

        return`
            <div class="project-card">

                <h3>
                    ${project.name}
                </h3>

                <p class="project-description">
                    ${project.description || "No description provided"}
                </p>

                <div class="project-info">

                <span>
    <strong>Priority:</strong>
    <span class="priority-badge priority-${project.priority}">
        ${project.priority}
    </span>
</span>

                    <span>
                        <strong>Start:</strong>
                        ${startDate}
                    </span>

                    <span>
                        <strong>Deadline:</strong>
                        ${deadline}
                    </span>

                    <span>
    <strong>Status:</strong>
    <span class="status-badge status-${project.status}">
        ${project.status}
    </span>
</span>

                </div>

                <div class="project-actions">

                    <button
                        class="edit-project-btn"
                        onclick="editProject('${project._id}')"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-project-btn"
                        onclick="deleteProject('${project._id}')"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;

    }).join("");
}

async function deleteProject(projectId)
{
    const confirmDelete = confirm("Are u sure u want to delete this project");
    if(!confirmDelete)
    {
        return
    }

    try{
        const response = await fetch(`http://localhost:3000/projects/${projectId}`,
            {
                method:"DELETE",
                headers:{
                     "Authorization": `Bearer ${token}`
                }

            }
        );
        const data = await response.json();

        if(!response.ok)
        {
            alert("Failed to deltete this project")
        }
        alert("project deleted successfully");
        loadProjects();


    }catch(error)
    {
        console.error(error)
        
    }
}

//editproject

async function editProject(projectId)
{
    try{
        const response = await fetch ( `http://localhost:3000/projects/${projectId}`,
            {
                method:"GET",

                headers:{
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        const data = await response.json();

        if(!response.ok)
        {
            alert("Failed to load the project");
            return;
        }

         const project = data.project;

         editingProjectId = projectId

         projectFormSection.classList.add("show");

         document.querySelector(".form-header h2").textContent =
            "Edit Project";

            document.getElementById("projectName").value =
            project.name;

        document.getElementById("projectDescription").value =
            project.description || "";

        document.getElementById("startDate").value =
            project.startDate.split("T")[0];

        document.getElementById("deadline").value =
            project.deadline.split("T")[0];

        document.getElementById("projectPriority").value =
            project.priority;

        document.getElementById("projectStatus").value =
    project.status;

        // Change button text
        document.querySelector(".save-project-btn").textContent =
            "Update Project";

        // Scroll to form
        projectFormSection.scrollIntoView({
            behavior: "smooth"
        });
    }catch(error)
    {
        console.error(error);
    }
}





// ==========================
// LOAD PROJECTS
// ==========================

loadProjects();