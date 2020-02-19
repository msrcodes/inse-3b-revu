'use strict';

const handles = {};

async function checkLoginStatus() {
	const response = await fetch('api/v1/account/loggedIn');

	if (response.ok) {
		const obj = await response.json();
		console.log(obj);
		if (obj.loggedIn) {
			console.log("user is logged in");
			return true;
		} else {
			console.log("user is not logged in");
			return false;
		}
	} else {
		console.log('unable to retrieve login status', response); // TODO: proper error handling
	}
	return false;
}

function updateStatus(loggedin) {
	if (loggedin) {
		handles.status.textContent = "USERNAME GOES HERE"; // TODO
		handles.link.href = "profilePage.html";
	} else {
		handles.status.textContent = "Log In";
		handles.link.href = "login.html";
	}
}

function getHandles() {
	handles.status = document.querySelector("#username-profile-status");
	handles.link = document.querySelector("#profile-a-link");
}

async function onLoad() {
	getHandles();
	const loggedin = await checkLoginStatus();
	updateStatus(loggedin);
}

window.addEventListener('load', onLoad);
