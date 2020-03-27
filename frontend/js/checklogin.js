'use strict';

const loginHandles = {};

async function checkLoginStatus() {
	const response = await fetch('api/v1/account/loggedIn');

	if (response.ok) {
		return await response.json();
	} else {
		console.log('unable to retrieve login status', response); // TODO: proper error handling
	}
	return false;
}

function updateStatus(obj) {
	if (obj.loggedIn) {
		loginHandles.status.textContent = obj.username; // TODO
		loginHandles.link.href = "profile";

		loginHandles.reviewBtn.href = "createReview";
	} else {
		loginHandles.status.textContent = "Log In";
		loginHandles.link.href = "login";

		loginHandles.reviewBtn.href = "login";
	}
}

function getLoginHandles() {
	loginHandles.status = document.querySelector("#username-profile-status");
	loginHandles.link = document.querySelector("#profile-a-link");

	loginHandles.reviewBtn = document.querySelector("#a-writereview");
}

async function onPageLoad() {
	getLoginHandles();
	const obj = await checkLoginStatus();
	updateStatus(obj);
}

window.addEventListener('load', onPageLoad);
