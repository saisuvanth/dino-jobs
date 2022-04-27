const elem = document.getElementById('select-user');

async function handleGetUser(event) {
	event.preventDefault();
	const value = event.target.value;
	const res = await fetch(`http://localhost:3000/job/${value}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(value)
	});
}