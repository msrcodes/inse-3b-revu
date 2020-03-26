'use strict';

const handles = {};

/**
 * Used to check if the user is currently logged in, and redirects the user to the homepage if they're not
 * @returns {Promise<void>}
 */
async function checkAndRedirect() {
	const response = await fetch('api/v1/account/loggedIn');

	if (response.ok) {
		const status = await response.json();

		if (status.loggedIn) {
			handles.username.textContent = status.username;
		} else {
			window.location = "/login";
		}
	} else {
		console.log('unable to retrieve login status', response); // TODO: proper error handling
	}
}

async function getUserReviews() {
	const respDetails = await fetch('api/v1/account/details');
	let reviews;
	if (respDetails.ok) {
		const respJson = await respDetails.json();
		const response = await fetch(`api/v1/review/user/${respJson.user_id}`);

		if (response.ok) {
			const json = response.json();
			reviews = json;
		} else {
			reviews = ['No reviews found'];
		}
	} else {
		reviews = ['Unable to get account details'];
	}

	return reviews;
}

async function getUserSearches() {
	const respSearches = await fetch('api/v1/account/searches');
	let searches;
	if (respSearches.ok) {
		searches = await respSearches.json();
	} else {
		searches = [];
	}
	return searches;
}

async function doSearchFromProfile(text) {
	const query = {
		text: text,
		type: 'all',
		ucas: 0,
		category: 'all',
		level: 'all',
		studyType: 'all',
		sandwich: 'all',
	};

	const response = await fetch(`api/v1/search?text=${query.text}&type=${query.type}&ucas=${query.ucas}&category=${query.category}&level=${query.level}&studyType=${query.studyType}&sandwich=${query.sandwich}`);

	if (response.ok) {
		const json = await response.json();

		sessionStorage.setItem('searchText', query.text);
		sessionStorage.setItem('results', JSON.stringify(json));

		window.location = '/searchResults';
	} else {
		console.error(response.statusText);
	}
}

async function populateUserSearches(searches) {
	const searchContainer = document.querySelector("#search-container");

	for (const search of searches) {
		const elem = document.createElement("li");
		elem.appendChild(document.createTextNode(search.text));

		elem.classList.add("card");

		elem.addEventListener('click', () => doSearchFromProfile(search.text));

		searchContainer.appendChild(elem);
	}
}

async function populateUserReviews(reviews) {
	const template = document.querySelector("#review-profile-display");
	const container = document.querySelector("#review-container");

	for (const review of reviews) {
		const clone = template.content.cloneNode(true);

		const nameResponse = await fetch(`api/v1/uni/${review.uni_id}`);
		if (nameResponse.ok) {
			const json = await nameResponse.json();

			clone.querySelector(".uni-name").textContent = json.uni_name;
		} else {
			clone.querySelector(".uni-name").textContent = "Unknown University";
		}

		const degreeResponse = await fetch(`api/v1/degree/${review.degree_id}`);
		if (degreeResponse.ok) {
			const json = await degreeResponse.json();

			clone.querySelector(".degree-name").textContent = json.degree_name;
		} else {
			clone.querySelector(".degree-name").textContent = "Unknown Degree";
		}

		const rating = (Number(review.degree_rating) + Number(review.staff_rating) + Number(review.facility_rating) + Number(review.uni_rating) + Number(review.accommodation_rating)) / 5;

		clone.querySelector(".rating").textContent = `Your Rating: ${rating.toFixed(1)}`;

		clone.querySelector(".edit").href = `/editReview?review_id=${review.review_id}`;

		// TODO: delete?

		container.appendChild(clone);
	}
}

async function logout() {
	// Check that the user has a session cookie
	if (document.cookie.split(';').filter((item) => item.trim().startsWith('session=')).length) {
		// If they do, log them out and redirect to home page
		document.cookie = "session=; undefined";
		window.location = "/";
	} else {
		console.log('cannot logout user that is not logged in');
	}
}

function getHandles() {
	handles.btnLogout = document.querySelector("#btn-logout");
	handles.username = document.querySelector("#profile-header-info-username");
}

function addEventListeners() {
	handles.btnLogout.addEventListener('click', logout);
}

async function onLoad() {
	getHandles();
	const status = await checkAndRedirect();
	addEventListeners();
	getUserReviews(status).then(reviews => populateUserReviews(reviews));
	getUserSearches().then(searches => populateUserSearches(searches));
}

window.addEventListener('load', onLoad);
