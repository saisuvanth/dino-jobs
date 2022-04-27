async function handleSubmit(event) {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const data = {};
	formData.forEach((value, key) => {
		data[key] = value;
	});

	console.log(data)
	const res = await fetch(`http://localhost:3000/manager/home`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	if (res.status === 400) {
		gotData = await res.json();
		let alert = document.createElement("div");
		alert.classList.add("alert", "alert-danger");
		alert.innerText = gotData.result;
		document.getElementById("alert-div").appendChild(alert);
		setTimeout(() => {
			alert.remove();
			window.location.href = "http://localhost:3000/manager/home";
		}, 3000);
	} else if (res.status === 200) {
		window.location.href = `http://localhost:3000/manager/home`
	}

}
