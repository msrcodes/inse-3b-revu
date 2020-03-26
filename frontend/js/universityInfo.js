'use strict';

const elems= {};

function getUniID() {
	const url = window.location.search; //get url contents
	const urlParams = new URLSearchParams(url);
	 //get uniId from url
	return urlParams.get('uniId');
}

async function getInfo() {
	const response = await fetch(`/api/v1/uni/${getUniID()}`);

	if (response.ok) {
		const data = await response.json();
		elems.uniName.textContent = data.uni_name;
	} else {
		console.error(response.statusText);
		// Uni not found error
	}
}

async function getAverageReviews() {
	const response = await fetch(`/api/v1/review/university/${getUniID()}/average`);
	if (response.ok) {
		const data = await response.json();
		elems.avgDegreeRating.textContent = `Average degree rating: ${Number(data.avg_degree_rating).toFixed(1)}`;
		elems.staffRating.textContent = `Staff rating: ${Number(data.avg_staff_rating).toFixed(1)}`;
		elems.facilityRating.textContent = `Facilities rating: ${Number(data.avg_facility_rating).toFixed(1)}`;
		elems.universityRating.textContent = `University rating: ${Number(data.avg_uni_rating).toFixed(1)}`;
		elems.accommodationRating.textContent = `Accommodation rating: ${Number(data.avg_accommodation_rating).toFixed(1)}`;
	} else {
		console.error((response.statusText));
	}
}

async function getReviews() {
	const response = await fetch('/api/v1/review/university/' + getUniID());
	if (response.ok) {
		const data = await response.json();
		const template = document.querySelector("#review-template");

		for (const review of data) {
			const clone = template.content.cloneNode(true);

			const responseDegree = await fetch('/api/v1/degree/' + review.degree_id); // get degree name
			const dataDegree = await responseDegree.json();

			clone.querySelector("#degree-id").textContent = dataDegree.degree_name;
			clone.querySelector("#degree-review-rating").textContent = `Degree: ${review.degree_rating}/5`;
			clone.querySelector("#degree-review-review").textContent = review.degree_rating_desc;
			clone.querySelector("#staff-review-rating").textContent = `Staff: ${review.staff_rating}/5`;
			clone.querySelector("#staff-review-review").textContent = review.staff_rating_desc;
			clone.querySelector("#facility-review-rating").textContent = `Facilities: ${review.facility_rating}/5`;
			clone.querySelector("#facility-review-review").textContent = review.facility_rating_desc;
			clone.querySelector("#university-review-rating").textContent = `University Experience: ${review.uni_rating}/5`;
			clone.querySelector("#university-review-review").textContent = review.uni_rating_desc;
			clone.querySelector("#accommodation-review-rating").textContent = `Accommodation: ${review.accommodation_rating}/5`;
			clone.querySelector("#accommodation-review-review").textContent = review.accommodation_rating_desc;

			elems.container.append(clone);
	}
}
}

function getElems() {
	elems.uniName = document.querySelector("#uni-name");
	elems.avgDegreeRating = document.querySelector("#avg-degree-rating");
	elems.staffRating = document.querySelector("#staff-rating");
	elems.facilityRating = document.querySelector("#facility-rating");
	elems.universityRating = document.querySelector("#university-rating");
	elems.accommodationRating = document.querySelector("#accommodation-rating");
	elems.container = document.querySelector('#reviews');
	elems.templateFail = document.querySelector('#no-reviews-found'); //might removed idk
}

async function onLoad() {
	getElems();
	await getInfo();
	await getAverageReviews();
	await getReviews();
}

window.addEventListener('load', onLoad);
