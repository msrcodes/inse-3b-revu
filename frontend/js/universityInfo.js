'use strict';

const elems= {};

function getUniID() {
	const url = window.location.search; //get url contents
	const urlParams = new URLSearchParams(url);
	const uniId = urlParams.get('uniId'); //get uniId from url
	return uniId;
}

async function getInfo() {
	const response = await fetch('/api/v1/uni/' + getUniID());

	if (response.ok) {
		const data = await response.json();
		elems.uniName.textContent = data.uni_name;
	} else {
		console.error(response.statusText);
		//Uni not found error
	}
}

async function getAverageReviews() {


	const response = await fetch('/api/v1/review/university/'+getUniID()+'/average');
	if (response.ok) {
		const data = await response.json();
		elems.avgDegreeRating.textContent = "Average degree rating : " + Math.round(data.avg_degree_rating);
		elems.staffRating.textContent = "Staff rating : " + Math.round(data.avg_staff_rating);
		elems.facilityRating.textContent = "Facilities rating : " + Math.round(data.avg_facility_rating);
		elems.universityRating.textContent = "University rating : " + Math.round(data.avg_uni_rating);
		elems.accommodationRating.textContent = "Accommodation rating : " + Math.round(data.avg_accommodation_rating)
	}
	else
	{
		console.error((response.statusText));
	}
}

async function getReviews() {
	const response = await fetch('/api/v1/review/university/' + getUniID());
	if (!response.ok) {
		console.error("No reviews found");
		//Uni not found error
	}
	const data = await response.json();

	console.log(data.uni_id);
	if (!data.ok) {
		console.error(response.statusText);
		const clone = elems.templateFail.content.cloneNode(true);
		elems.container.append(clone);
		return;
	}

	for (const reviews of data) {
		const clone = elem.template.content.cloneNode(true);

		elems.reviewUniId.textContent = data.uni_id;
		elems.reviewDegreeId.textContent = data.degree_id
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
	elems.uniName = document.querySelector("#uni-name");
	elems.avgDegreeRating = document.querySelector("#avg-degree-rating");
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
