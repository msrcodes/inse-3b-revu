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
		loginHandles.link.href = "profile.html";
	} else {
		loginHandles.status.textContent = "Log In";
		loginHandles.link.href = "login";
	}
}

function getLoginHandles() {
	loginHandles.status = document.querySelector("#username-profile-status");
	loginHandles.link = document.querySelector("#profile-a-link");
}

async function onPageLoad() {
	getLoginHandles();
	const obj = await checkLoginStatus();
	updateStatus(obj);
}

window.addEventListener('load', onPageLoad);
