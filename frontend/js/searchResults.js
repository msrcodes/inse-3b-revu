const elems = {};

function get() {
	return sessionStorage.getItem('results');
}

function compareByName(a, b) {
	if (a.uni_name < b.uni_name) {
		return -1;
	}

	if (a.uni_name > b.uni_name) {
		return 1;
	}

	return 0;
}

function sort(results) {
	const val = elems.sort.value;

	if (val === "alpha_desc") {
		return results.sort(compareByName);
	} else if (val === "alpha_asc") {
		return results.sort(compareByName).reverse();
	}

	return results;
}

function populate() {
	let results = get();

	if (results == null) {
		return;
	}

	// get JS object
	results = JSON.parse(results);

	// sort
	results = sort(results);

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
		clone.querySelector(".btn--default").addEventListener('click', () => window.location = `/universityInfo?uniId=${result.uni_id}`);

		container.append(clone);
	}
}

function addEventListeners() {
	elems.sort.addEventListener('change', () => {
		const container = document.querySelector("#results-container");

		container.innerHTML = "";

		populate();
	});
}

function getElems() {
	elems.info = document.querySelector("#info");
	elems.sort = document.querySelector("#sort");
}

function onLoad() {
	getElems();
	addEventListeners();
	populate();
}

window.addEventListener('load', onLoad);
