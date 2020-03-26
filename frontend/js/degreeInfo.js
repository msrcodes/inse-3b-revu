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
		elems.universityRating.textContent = "University rating : " + (parseFloat(data.avg_uni_rating).toFixed(1));
		elems.accommodationRating.textContent = "Accommodation rating : " + (parseFloat(data.avg_accommodation_rating).toFixed(1));
	}
	else
	{
		console.error((response.statusText));
	}
}

async function getReviews() {
	const response = await fetch('/api/v1/review/degree/' + getDegreeID());
	if (!response.ok) {
		console.error("No reviews found");
		//Uni not found error
	}
	const data = await response.json();

	console.log(data.degree_id);
	if (!data.ok) {
		console.error("No reviews found");
		const clone = elems.templateFail.content.cloneNode(true);
		elems.container.append(clone);
		return;
	}

	for (const reviews of data) {
		const clone = elem.template.content.cloneNode(true);

		elems.reviewUniId.textContent = data.degree_id;
		elems.reviewDegreeId.textContent = data.uni_id;
		elems.reviewAvgDegreeRating.textContent = "Degree rating: " + data.degree_rating;
		elems.reviewDegreeReview.textContent = data.degree_rating_desc;
		elems.reviewSatffRating.textContent = "Staff rating: " + data.staff_rating;
		elems.reviewStaffReview.textContent = data.staff_rating_desc;
		elems.reviewFacilityRating.textContent = "Facility rating: " + data.facility_rating;
		elems.reviewFacilityReview.textContent = data.facility_rating_desc;
		elems.reviewUniversityRating.textContent = "University rating: " + data.university_rating;
		elems.reviewUniversityReview.textContent = data.university_rating_desc;
		elems.reviewAccommodationRating.textContent = "Accommodation rating: " + data.accommodation_rating;
		elems.reviewAccommodationReview.textContent = data.accommodation_rating_desc;
	}
}

function getElems() {
	elems.degreeName = document.querySelector("#degree-name-text");
	elems.staffRating = document.querySelector("#staff-rating");
	elems.facilityRating = document.querySelector("#facility-rating");
	elems.universityRating = document.querySelector("#university-rating");
	elems.accommodationRating = document.querySelector("#accommodation-rating");

	elems.template = document.querySelector("#review-template");
	elems.templateFail = document.querySelector('#no-reviews-found');
	elems.container = document.querySelector('#reviews');
	elems.loadMoreReviewsButton = document.querySelector("load-more-reviews");


	elems.reviewUniId = document.querySelector("uni-id");
	elems.reviewDegreeId = document.querySelector("degree-id");
	elems.reviewAvgDegreeRating = document.querySelector("degree-review-rating");
	elems.reviewDegreeReview = document.querySelector("degree-review-review");
	elems.reviewSatffRating = document.querySelector("staff-review-rating");
	elems.reviewStaffReview = document.querySelector("staff-review-review");
	elems.reviewFacilityRating = document.querySelector("facility-review-rating");
	elems.reviewFacilityReview = document.querySelector("facility-review-review");
	elems.reviewUniversityRating = document.querySelector("university-review-rating");
	elems.reviewUniversityReview = document.querySelector("university-review-review");
	elems.reviewAccommodationRating = document.querySelector("accommodation-review-rating");
	elems.reviewAccommodationReview = document.querySelector("accommodation-review-rating");


}
function onLoad() {
	getElems();
	getInfo();
	getAverageReviews();
	getReviews();
}

window.addEventListener('load', onLoad);
