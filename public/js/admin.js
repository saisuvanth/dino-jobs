async function handleSubmit(event) {
	event.preventDefault();
	const form = event.target;
	const data = new FormData(form);
	const password = data.get("password");

	const res = await fetch(`http://localhost:3000/admin/login`, {
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
		window.location.href = `http://localhost:3000/admin`
	} else {
		let alert = document.createElement("div");
		alert.classList.add("alert", "alert-danger");
		alert.innerText = "User not Authorized!!";
		document.getElementById("alert-div").appendChild(alert);
		setTimeout(() => {
			alert.remove();
			window.location.href = "http://localhost:3000/";
		}, 3000);
	}
}