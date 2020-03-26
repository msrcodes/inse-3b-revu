const elems = {};

function get() {
	return sessionStorage.getItem('results');
}

function compareByName(a, b) {
	let aName;
	if (a.degree_name != null) {
		aName = a.degree_name;
	} else {
		aName = a.uni_name;
	}

	let bName;
	if (b.degree_name != null) {
		bName = b.degree_name;
	} else {
		bName = b.uni_name;
	}

	if (aName < bName) {
		return -1;
	}

	if (aName > bName) {
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

function filter(results) {
	const showUniversities = elems.showUniversities.checked;
	const showDegrees = elems.showDegrees.checked;
	const minUCAS = elems.ucasMin.value;
	const maxUCAS = elems.ucasMax.value;

	let filtered = [];

	for (let result of results) {
		if (result.degree_name != null) { // if it is a degree...
			if (showDegrees) {
				if (result.requirements_ucas < minUCAS || result.requirements_ucas > maxUCAS)
					continue; // if out of UCAS bounds, skip

				filtered.push(result);
			}
		} else { // if it is a university...
			if (showUniversities) {
				filtered.push(result);
			}
		}
	}

	return filtered;
}

function populate() {
	let results = get();

	if (results == null) {
		return;
	}

	// get JS object
	results = JSON.parse(results);

	// filter
	results = filter(results);

	// sort
	results = sort(results);

	// populate info
	if (results.length === 1) {
		elems.info.textContent = `${results.length} result found`;
	} else if (results.length >= 100) {
		elems.info.textContent = `${results.length} results found, showing 100`;
	} else {
		elems.info.textContent = `${results.length} results found`;
	}

	// display first 100 results
	results = results.splice(0, 100);

	// add li elems
	const template = document.querySelector("#li-template");
	const container = document.querySelector("#results-container");

	for (const result of results) {
		const clone = template.content.cloneNode(true);

		if (result.degree_name != null) { // if it is a degree...
			clone.querySelector(".result-main").textContent = result.degree_name;
			clone.querySelector(".result-sub").textContent = result.uni_name;
			clone.querySelector(".result-rating").textContent = ""; // TODO
			clone.querySelector(".btn--default").addEventListener('click', () => window.location = `/degreeInfo?degreeId=${result.degree_id}`);

			container.append(clone);
		} else { // if it is a university...
			clone.querySelector(".result-main").textContent = result.uni_name;
			clone.querySelector(".result-sub").textContent = "";
			clone.querySelector(".result-rating").textContent = ""; // TODO
			clone.querySelector(".btn--default").addEventListener('click', () => window.location = `/universityInfo?uniId=${result.uni_id}`);

			container.append(clone);
		}
	}
}

function refresh() {
	const container = document.querySelector("#results-container");

	container.innerHTML = "";

	populate();
}

function addEventListeners() {
	elems.sort.addEventListener('change', refresh);
	elems.showUniversities.addEventListener('change', refresh);
	elems.showDegrees.addEventListener('change', refresh);

	elems.ucasMin.addEventListener('change', () => {
		if (elems.ucasMin.value > elems.ucasMax.value) {
			elems.ucasMax.value = elems.ucasMin.value;
		}

		populate();
	});

	elems.ucasMax.addEventListener('change', () => {
		if (elems.ucasMin.value > elems.ucasMax.value) {
			elems.ucasMax.value = elems.ucasMin.value;
		}

		populate();
	});
}

function getElems() {
	elems.info = document.querySelector("#info");
	elems.sort = document.querySelector("#sort");

	elems.showUniversities = document.querySelector("#show-universities");
	elems.showDegrees = document.querySelector("#show-degrees");
	elems.ucasMin = document.querySelector("#ucas-min");
	elems.ucasMax = document.querySelector("#ucas-max");
}

function onLoad() {
	getElems();
	addEventListeners();
	populate();
}

window.addEventListener('load', onLoad);
