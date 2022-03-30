//Displaying content
const homeDisplay = document.getElementById("home");
const signDisplay = document.getElementById("signup");
const logDisplay = document.getElementById("login");

signDisplay.style.display = "none";
logDisplay.style.display = "none";

function displayHome() {
  homeDisplay.style.display = "block";
  signDisplay.style.display = "none";
  logDisplay.style.display = "none";
}

function displaySignup() {
  homeDisplay.style.display = "none";
  signDisplay.style.display = "block";
  logDisplay.style.display = "none";
}

function displayLogin() {
  homeDisplay.style.display = "none";
  signDisplay.style.display = "none";
  logDisplay.style.display = "block";
}

//Validating the form
async function handleSubmit(event, flag) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const password = data.get("password");
  if (flag === "login") {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.get("emailId"),
        password: data.get("password"),
        is_checked: data.get("loginInCheck"),
      }),
    });
    if (res.status === 200) {
      window.location.href = "http://localhost:3000/home";
    } else {
      location.reload();
    }
  } else {
    const confirmPassword = data.get("confirmPassword");
    if (password !== confirmPassword) {
      let passwords = document.getElementsByClassName("password-error");
      for (let i = 0; i < passwords.length; i++) {
        passwords[i].innerText = "Passwords do not match";
        passwords[i].classList.remove("text-muted");
        passwords[i].style.color = "red";
      }
      return;
    }
    fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: data.get("fullName"),
        email: data.get("emailId"),
        password: data.get("password"),
        is_checked: data.get("signedInCheck"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // if (data.result == "Mail Sent") {
        //   //add bootstrap alert
        //   let alert = document.createElement("div");
        //   alert.classList.add("alert", "alert-success");
        //   alert.innerText = "Verification mail sent";
        //   document.getElementById("alert-div").appendChild(alert);
        //   setTimeout(() => {
        //     alert.remove();
        //     window.location.href = "http://localhost:3000/";
        //   }, 3000);
        // }
      });
  }
}
