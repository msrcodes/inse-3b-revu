'use strict';

const elems= {};

function getDegreeID() {
	const url = window.location.search; //get url contents
	const urlParams = new URLSearchParams(url);
	const degreeId = urlParams.get('degreeId'); //get uniId from url
	return degreeId;
}

async function getInfo() {
	const response = await fetch('/api/v1/degree/' + getDegreeID());

	if (response.ok) {
		const data = await response.json();
		elems.degreeName.textContent = data.degree_name;

	} else {
		console.error(response.statusText);
		//Degree not found error
	}
}

async function getAverageReviews() {


	const response = await fetch('/api/v1/review/degree/'+getDegreeID()+'/average');
	if (response.ok) {
		const data = await response.json();
		elems.staffRating.textContent = "Staff rating : " + (parseFloat(data.avg_staff_rating).toFixed(1));
		elems.facilityRating.textContent = "Facilities rating : " + (parseFloat(data.avg_facility_rating).toFixed(1));
		elems.accommodationRating.textContent = "Accommodation rating : " + (parseFloat(data.avg_accommodation_rating).toFixed(1));
	}
	else
	{
		console.error((response.statusText));
	}
}

async function getReviews() {
	const response = await fetch('/api/v1/review/degree/' + getDegreeID());
	if(response.ok) {
		const data = await response.json();
		const template = document.querySelector("#review-template");

		for (const review of data) {
			const clone = template.content.cloneNode(true);

			const responseUni = await fetch('/api/v1/degree/' + review.degree_id); //get degree name
			const dataUni = await responseUni.json();

			clone.querySelector("#degree-id").textContent = dataUni.degree_name;

			const responseDegree = await fetch('/api/v1/uni/' + review.uni_id); //get uni name
			const dataDegree = await responseDegree.json();

			clone.querySelector("#uni-id").textContent = dataDegree.uni_name;
			clone.querySelector("#degree-review-rating").textContent = "Degree rating: " + review.degree_rating;
			clone.querySelector("#degree-review-review").textContent = review.degree_rating_desc;
			clone.querySelector("#staff-review-rating").textContent = "Staff rating: " + review.staff_rating;
			clone.querySelector("#staff-review-review").textContent = review.staff_rating_desc;
			clone.querySelector("#facility-review-rating").textContent = "Facility rating: " + review.facility_rating;
			clone.querySelector("#facility-review-review").textContent = review.facility_rating_desc;
			clone.querySelector("#university-review-rating").textContent = review.uni_rating;
			clone.querySelector("#university-review-review").textContent = review.uni_rating_desc;
			clone.querySelector("#accommodation-review-rating").textContent = "Accommodation rating: " + review.accommodation_rating;
			clone.querySelector("#accommodation-review-review").textContent = review.accommodation_rating_desc;

			elems.container.append(clone);
		}
	}
}

function getElems() {
	elems.degreeName = document.querySelector("#degree-name-text");
	elems.staffRating = document.querySelector("#staff-rating");
	elems.facilityRating = document.querySelector("#facility-rating");
	elems.accommodationRating = document.querySelector("#accommodation-rating");

	elems.container = document.querySelector('#reviews');

}
function onLoad() {
	getElems();
	getInfo();
	getAverageReviews();
	getReviews();
}

window.addEventListener('load', onLoad);
