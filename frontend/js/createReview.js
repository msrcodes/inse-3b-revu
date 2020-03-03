'use strict';

const handles = {};

function getFormData() {
	return {
		universityName: handles.universityDropdown.value,
		staffRating: handles.staffRating.value,
		staffReview: handles.staffReview.value,
		facilityRating: handles.facilityRating.value,
		facilityReview: handles.facilityReview.value,
		universityRating: handles.universityRating.value,
		universityReview: handles.universityReview.value,
		accommodationRating: handles.accommodationRating.value,
		accommodationReview: handles.accommodationReview.value
	};
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
		console.log('failed to create review', response);
	}
}

function getHandles() {
	handles.universityDropdown = document.querySelector("#university-dropdown");
	handles.staffRating = document.querySelector("#staffRating");
	handles.staffReview = document.querySelector("#staffReview");
	handles.facilityRating = document.querySelector("#facilityRating");
	handles.facilityReview = document.querySelector("#facilityReview");
	handles.universityRating = document.querySelector("#universityRating");
	handles.universityReview = document.querySelector("#universityReview");
	handles.accommodationRating = document.querySelector("#accommodationRating");
	handles.accommodationReview = document.querySelector("#accommodationReview");
	handles.submit = document.querySelector("#submit-review");
}

function addEventListeners() {
	handles.submit.addEventListener('click', postCreateRequest);
}

function onLoad() {
	getHandles();
	addEventListeners();
}

window.addEventListener('load', onLoad);
