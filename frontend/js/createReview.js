'use strict';

const handles = {};

function getFormData() {
	return {
		universityID: Number(handles.universityDropdown.value),
		degreeID: Number(handles.degreeDropdown.value),
		degreeRating: Number(handles.degreeRating.value),
		degreeReview: handles.degreeReview.value,
		staffRating: Number(handles.staffRating.value),
		staffReview: handles.staffReview.value,
		facilityRating: Number(handles.facilityRating.value),
		facilityReview: handles.facilityReview.value,
		universityRating: Number(handles.universityRating.value),
		universityReview: handles.universityReview.value,
		accommodationRating: Number(handles.accommodationRating.value),
		accommodationReview: handles.accommodationReview.value
	};
}

async function getUniversities() {
	const response = await fetch(`api/v1/uni/uniNames`);

	let array;
	if (response.ok) {
		array = await response.json();

		for (const i of array) {
			const elem = document.createElement("option");
			elem.appendChild(document.createTextNode(i.uni_name));
			elem.value = i.uni_id;
			handles.universityDropdown.appendChild(elem);
		}
	} else {
		window.location.reload(); // refresh on fail
	}
}

async function getDegrees() {
	const response = await fetch(`api/v1/degree/degreeNames`);

	let array;
	if (response.ok) {
		array = await response.json();

		for (const i of array) {
			const elem = document.createElement("option");
			elem.appendChild(document.createTextNode(i.degree_name));
			elem.value = i.degree_id;
			handles.degreeDropdown.appendChild(elem);
		}
	} else {
		window.location.reload(); // refresh on fail
	}
}

async function postCreateRequest() {
	const payload = getFormData();

	const response = await fetch('api/v1/review/create', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(payload),
	});

	if (response.ok) {
		// redirect to profile page
		window.location = "/profile";
	} else {
		const json = await response.json();
		handles.error.textContent = json.error;
		console.error('failed to create review', response);
	}
}

function getHandles() {
	handles.universityDropdown = document.querySelector("#university-dropdown");
	handles.degreeRating = document.querySelector("#degreeRating");
	handles.degreeReview = document.querySelector("#degreeReview");
	handles.staffRating = document.querySelector("#staffRating");
	handles.staffReview = document.querySelector("#staffReview");
	handles.facilityRating = document.querySelector("#facilityRating");
	handles.facilityReview = document.querySelector("#facilityReview");
	handles.universityRating = document.querySelector("#universityRating");
	handles.universityReview = document.querySelector("#universityReview");
	handles.accommodationRating = document.querySelector("#accommodationRating");
	handles.accommodationReview = document.querySelector("#accommodationReview");
	handles.submit = document.querySelector("#submit-review");
	handles.error = document.querySelector(".error");
	handles.universityDropdown = document.querySelector("#university-dropdown");
	handles.degreeDropdown = document.querySelector("#degree-dropdown");
}

function addEventListeners() {
	handles.submit.addEventListener('click', postCreateRequest);
}

async function onLoad() {
	getHandles();
	addEventListeners();
	await getUniversities();
	await getDegrees();
}

window.addEventListener('load', onLoad);
