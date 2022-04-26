const img = document.getElementById("avatar");
const avatar_container = document.getElementById("user-avatar");
let b64str = "";
function handleImage() {
  document.getElementById("avatar").click();
}

document.getElementById("avatar").addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    avatar_container.src = e.target.result;
    b64str = reader.result.replace("data:", "")
      .replace(/^.+,/, "");
    b64str = `data:image/${file.name.split('.').pop()};base64,` + b64str;
  };
  reader.readAsDataURL(file);
});

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  data.avatar = b64str;
  fetch("/update-user", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
  console.log(data);
}

// function repeat() {
//   document.getElementById('clone').innerText += `<%- include('../../partials/Work.ejs') %>`;
// }

// document.getElementById('my-badge').style.display = "none";

// function addBadge() {
//   const cont = document.getElementById('my-badge');
//   cont.style.display = "block";
//   const bad = document.createElement('span');
//   bad.classList.add('badge', 'rounded-pill', 'bg-info', 'text-dark', 'badges');
//   const badg = document.getElementById("exampleFormControlSelect1");
//   const addinBadge = badg.options[badg.selectedIndex].text;
//   bad.textContent = addinBadge;
//   cont.appendChild(bad);
// }

