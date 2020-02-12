async function fetchUniversities() {
	let out = [];

	/** CORS is blocked on the API (why?) so if we want to do this on the client side we need to use a router */
	const url = "https://cors-anywhere.herokuapp.com/http://universities.hipolabs.com/search?country=United%20Kingdom";
	const response = await fetch(url);
	const json = await response.json();

	for (const obj of json) {
		/** Checking for duplicate entries is necessary as API can return 2 instances of the same university */
		if (!out.includes(obj.name))
			out.push(obj.name);
	}

	/** Sort for visual clarity in dropdowns */
	out.sort();

	return out;
}

function populateDropdown(dropdown, array) {
	for (const i of array) {
		const elem = document.createElement("option");
		elem.appendChild(document.createTextNode(i));
		dropdown.appendChild(elem);
	}
}

const dropdown = document.querySelector("#university-dropdown");
window.addEventListener('load', () => fetchUniversities().then(result => populateDropdown(dropdown, result)));
