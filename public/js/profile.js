const img = document.getElementById("avatar");
const avatar_container = document.getElementById("user-avatar");

function handleImage() {
  document.getElementById("avatar").click();
}

document.getElementById("avatar").addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    avatar_container.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

async function handleSubmit(event) {}
