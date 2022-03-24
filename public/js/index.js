const h = document.getElementById("home");
const s = document.getElementById("signup");
const l = document.getElementById("login");




const homeDisplay = document.getElementById("text"); 
const signDisplay = document.getElementById("sign"); 
const logDisplay = document.getElementById("log"); 


signDisplay.style.display="none";
logDisplay.style.display="none";

h.addEventListener("click", func1);
s.addEventListener("click", func2);
l.addEventListener("click", func3);

function func1(){
   homeDisplay.style.display="block";
   signDisplay.style.display="none";
   logDisplay.style.display="none";
}

function func2(){
  AOS.init();
  homeDisplay.style.display="none";
  signDisplay.style.display="block";
  logDisplay.style.display="none";
  
}

function func3(){
  homeDisplay.style.display="none";
  signDisplay.style.display="none";
  logDisplay.style.display="block";
}
