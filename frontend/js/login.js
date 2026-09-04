const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit",async(event)=>{

    event.preventDefault();

     const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try
    {
        const response = await fetch(
              "http://localhost:3000/auth/login",
              {
                method:"POST",

                headers:{
                     "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    email,password

                })
              }
        );

        const data = await response.json();

        if(!response.ok)
        {
            message.textContent=data.message;
            return;
        }

         localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Move to dashboard
        window.location.href = "dashboard.html";

    }catch(error)
{
    console.error(error)
     message.textContent = "Unable to connect to server";
}
})