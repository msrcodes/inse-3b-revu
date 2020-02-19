'use strict';

const handles = {};

async function logout() {
	// Check that the user has a session cookie
	if (document.cookie.split(';').filter((item) => item.trim().startsWith('session=')).length) {
		// If they do, log them out and redirect to home page
		document.cookie = "session=; undefined";
		window.location = window.location.toString().substring(0, window.location.toString().length - "profile.html".length) + "app.html"; // TODO: this, better.
	} else {
		console.log('cannot logout user that is not logged in');
	}
}

function getHandles() {
	handles.btnLogout = document.querySelector("#btn-logout");
}

function addEventListeners() {
	handles.btnLogout.addEventListener('click', logout);
}

function onLoad() {
	getHandles();
	addEventListeners();
}

window.addEventListener('load', onLoad);
