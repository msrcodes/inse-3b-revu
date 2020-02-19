'use strict';

const loginHandles = {};

async function checkLoginStatus() {
	const response = await fetch('api/v1/account/loggedIn');

	if (response.ok) {
		const obj = await response.json();
		return obj.loggedIn;
	} else {
		console.log('unable to retrieve login status', response); // TODO: proper error handling
	}
	return false;
}

function updateStatus(loggedin) {
	if (loggedin) {
		loginHandles.status.textContent = "USERNAME GOES HERE"; // TODO
		loginHandles.link.href = "profilePage.html";
	} else {
		loginHandles.status.textContent = "Log In";
		loginHandles.link.href = "login.html";
	}
}

function getLoginHandles() {
	loginHandles.status = document.querySelector("#username-profile-status");
	loginHandles.link = document.querySelector("#profile-a-link");
}

async function onPageLoad() {
	getLoginHandles();
	const loggedin = await checkLoginStatus();
	updateStatus(loggedin);
}

window.addEventListener('load', onPageLoad);
