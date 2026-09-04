const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");

signupForm.addEventListener("submit",async(event)=>{

    event.preventDefault();

     const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try
    {
        const response = await fetch(
             "http://localhost:3000/auth/signup",
             {
                method: "POST",

                headers:{
                    "Content-Type": "application/json"
                },

                 body: JSON.stringify({
                    name,
                    email,
                    password,
                    role
                })

             }
        );

        const data = await response.json();

        if(!response.ok)
        {
            message.textContent = data.message;
        }

        signupForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    }catch(error)
    {
        console.error(error);

        message.textContent="unable to connect to server"
    }
})