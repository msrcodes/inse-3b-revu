const elems = {};

function get() {
	return sessionStorage.getItem('results');
}

function populate() {
	let results = get();

	if (results == null) {
		return;
	}

	// get JS object
	results = JSON.parse(results);

	// populate info
	if (results.length === 1) {
		elems.info.textContent = `${results.length} result found`;
	} else {
		elems.info.textContent = `${results.length} results found`;
	}

	// add li elems
	const template = document.querySelector("#li-template");
	const container = document.querySelector("#results-container");

	for (const result of results) {
		const clone = template.content.cloneNode(true);
		clone.querySelector(".result-main").textContent = result.uni_name;
		clone.querySelector(".result-sub").textContent = "";
		clone.querySelector(".result-rating").textContent = ""; // TODO
		// TODO: link button to view info page

		container.append(clone);
	}
}

function getElems() {
	elems.info = document.querySelector("#info");
}

function onLoad() {
	getElems();
	populate();
}

window.addEventListener('load', onLoad);
