'use strict';

const handles = {};

function getReviewID() {
	const url = window.location.search; //get url contents
	const urlParams = new URLSearchParams(url);
	//get reviewId from url
	return Number(urlParams.get('review_id'));
}

function getFormData() {
	return {
		universityId: Number(handles.universityDropdown.value),
		degreeId: Number(handles.degreeDropdown.value),
		reviewId: getReviewID(),
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

async function getExistingReview() {
	const response = await fetch(`api/v1/review/${getReviewID()}`);

	if (response.ok) {
		const json = await response.json();

		handles.universityDropdown.value = json.uni_id;
		handles.degreeDropdown.value = json.degree_id;
		handles.degreeRating.value = Number(json.degree_rating);
		handles.degreeRatingOutput.value = Number(json.degree_rating);
		handles.degreeReview.value = json.degree_rating_desc;
		handles.staffRating.value = Number(json.staff_rating);
		handles.staffRatingOutput.value = Number(json.staff_rating);
		handles.staffReview.value = json.staff_rating_desc;
		handles.facilityRating.value = Number(json.facility_rating);
		handles.facilityRatingOutput.value = Number(json.facility_rating);
		handles.facilityReview.value = json.facility_rating_desc;
		handles.universityRating.value = Number(json.uni_rating);
		handles.universityRatingOutput.value = Number(json.uni_rating);
		handles.universityReview.value = json.uni_rating_desc;
		handles.accommodationRating.value = Number(json.accommodation_rating);
		handles.accommodationRatingOutput.value = Number(json.accommodation_rating);
		handles.accommodationReview.value = json.accommodation_rating_desc;
	} else {
		window.location.reload(); // reload on error
	}
}

async function postEditRequest() {
	const payload = getFormData();

	const response = await fetch(`api/v1/review/update`, {
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
		console.error('failed to update review', response);
	}
}

function getHandles() {
	handles.universityDropdown = document.querySelector("#university-dropdown");
	handles.degreeDropdown = document.querySelector("#degree-dropdown");
	handles.degreeRating = document.querySelector("#degreeRating");
	handles.degreeRatingOutput = document.querySelector("#degreeOutput");
	handles.degreeReview = document.querySelector("#degreeReview");
	handles.staffRating = document.querySelector("#staffRating");
	handles.staffRatingOutput = document.querySelector("#staffOutput");
	handles.staffReview = document.querySelector("#staffReview");
	handles.facilityRating = document.querySelector("#facilityRating");
	handles.facilityRatingOutput = document.querySelector("#facilityOutput");
	handles.facilityReview = document.querySelector("#facilityReview");
	handles.universityRating = document.querySelector("#universityRating");
	handles.universityRatingOutput = document.querySelector("#universityOutput");
	handles.universityReview = document.querySelector("#universityReview");
	handles.accommodationRating = document.querySelector("#accommodationRating");
	handles.accommodationRatingOutput = document.querySelector("#accommodationOutput");
	handles.accommodationReview = document.querySelector("#accommodationReview");
	handles.submit = document.querySelector("#submit-review");
	handles.error = document.querySelector(".error");
}

function addEventListeners() {
	handles.submit.addEventListener('click', postEditRequest);
}

async function onLoad() {
	getHandles();
	addEventListeners();
	await getUniversities();
	await getDegrees();
	await getExistingReview();
}

window.addEventListener('load', onLoad);
