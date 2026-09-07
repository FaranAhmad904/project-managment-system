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


async function loadMemberDetails()
{
    try
    {
        const userResponse = await fetch (
                `http://localhost:3000/users`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const userData = await userResponse.json();

        if(!userResponse.ok)
        {
            console.error(
                userData.message ||
                "Failed to load users"
            );

            return;
        }


        const users = userData.users || [];

         const member =
            users.find(
                user =>
                    user._id.toString() ===
                    memberId
            );

        if(!member)
        {
            memberName.textContent="member not found"
        }

        displayMember(member);


        //get projects 

        const projectResponse = await fetch("http://localhost:3000/projects",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const projectData = await projectResponse.json();
        
        let projects = []

        if(projectResponse.ok)
        {
            projects = projectData.projects || []
        }

        //memer project lis

        

    }



}