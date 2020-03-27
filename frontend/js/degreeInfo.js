'use strict';

const elems = {};

function getDegreeID() {
	const url = window.location.search; // get url contents
	const urlParams = new URLSearchParams(url);
	// get uniId from url
	return urlParams.get('degreeId');
}

async function getInfo() {
	const response = await fetch(`/api/v1/degree/${getDegreeID()}`);

	if (response.ok) {
		const data = await response.json();
		elems.degreeName.textContent = data.degree_name;
	} else {
		console.error(response.statusText);
		// Degree not found error
	}
}

async function getAverageReviews() {
	const response = await fetch(`/api/v1/review/degree/${getDegreeID()}/average`);
	if (response.ok) {
		const data = await response.json();
		console.log(data);
		elems.degreeRating.textContent = `Average Degree rating: ${Number(data.avg_degree_rating).toFixed(1)}`;
		elems.staffRating.textContent = `Average Staff rating: ${Number(data.avg_staff_rating).toFixed(1)}`;
		elems.facilityRating.textContent = `Average Facilities rating: ${Number(data.avg_facility_rating).toFixed(1)}`;
	} else {
		console.error((response.statusText));
	}
}

async function getReviews() {
	const response = await fetch(`/api/v1/review/degree/${getDegreeID()}`);
	if (response.ok) {
		const data = await response.json();
		const template = document.querySelector("#review-template");

		for (const review of data) {
			const clone = template.content.cloneNode(true);

			const responseUni = await fetch(`/api/v1/degree/${review.degree_id}`); //get degree name
			const dataUni = await responseUni.json();

			const responseDegree = await fetch(`/api/v1/uni/${review.uni_id}`); //get uni name
			const dataDegree = await responseDegree.json();

			clone.querySelector("#uni-id").textContent = dataDegree.uni_name;
			clone.querySelector("#degree-review-rating").textContent = `Degree rating: ${review.degree_rating}/5`;
			clone.querySelector("#degree-review-review").textContent = review.degree_rating_desc;
			clone.querySelector("#staff-review-rating").textContent = `Staff rating: ${review.staff_rating}/5`;
			clone.querySelector("#staff-review-review").textContent = review.staff_rating_desc;
			clone.querySelector("#facility-review-rating").textContent = `Facility rating: ${review.facility_rating}/5`;
			clone.querySelector("#facility-review-review").textContent = review.facility_rating_desc;
			clone.querySelector("#university-review-rating").textContent = `University experience: ${review.uni_rating}/5`;
			clone.querySelector("#university-review-review").textContent = review.uni_rating_desc;
			clone.querySelector("#accommodation-review-rating").textContent = `Accommodation rating: ${review.accommodation_rating}/5`;
			clone.querySelector("#accommodation-review-review").textContent = review.accommodation_rating_desc;

			elems.container.append(clone);
		}
	}
}

function getElems() {
	elems.degreeName = document.querySelector("#degree-name-text");
	elems.degreeRating = document.querySelector("#degree-rating");
	elems.staffRating = document.querySelector("#staff-rating");
	elems.facilityRating = document.querySelector("#facility-rating");

	elems.container = document.querySelector('#reviews');
}

async function onLoad() {
	getElems();
	await getInfo();
	await getAverageReviews();
	await getReviews();
}

window.addEventListener('load', onLoad);
