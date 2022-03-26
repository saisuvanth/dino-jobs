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
function handleSubmit(event) {
  // event.preventDefault();
  console.log(event);
  const form = event.target;
  const data = new FormData(form);
  console.log(data);
  const password = data.get("password");
  const confirmPassword = data.get("confirmPassword");
  console.log(password, confirmPassword);
  if (password !== confirmPassword) {
    let passwords = document.getElementsByClassName("password-error");
    for (let i = 0; i < passwords.length; i++) {
      passwords[i].innerText = "Passwords do not match";
      passwords[i].classList.remove("text-muted");
      passwords[i].style.color = "red";
    }
    // alert("Passwords do not match");
    return false;
  }
}
