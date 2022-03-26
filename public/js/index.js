//Displaying content
const homeDisplay = document.getElementById("home");
const signDisplay = document.getElementById("signup");
const logDisplay = document.getElementById("login");

homeDisplay.style.display = "none";
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
  event.preventDefault();
  console.log(event);
  return true;
}
