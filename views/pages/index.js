const start = document.getElementById("btn");



const hideStart = document.getElementById("hide")
const logg = document.getElementById("log")
const signIn = document.getElementById("signn")


const login = document.getElementById("loging")
const signin = document.getElementById("sign")
const tit = document.getElementById("title")


login.style.display = "none";
signin.style.display = "none";


start.addEventListener("click", func1);
logg.addEventListener("click", func2);
signIn.addEventListener("click", func1);


function func1() {
	hideStart.style.display = "none";
	login.style.display = "none";
	signin.style.display = "block";
	tit.style.display = "none";
}


function func2() {
	hideStart.style.display = "none";
	login.style.display = "block";
	signin.style.display = "none";
	tit.style.display = "none";
}