'use strict';

const handles = {};

function getFormData() {
	return {
		"email": handles.username.value, // TODO: login should be via username, not email
		"password": handles.password.value,
	}
}

async function postLoginRequest() {
	const payload = getFormData();

	const response = await fetch('api/v1/account/login', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(payload),
	});

	if (response.ok) {
		// redirect to profile page
		window.location = window.location.toString().substring(0, window.location.toString().length - "login.html".length) + "profilePage.html"; // TODO: this, better.
	} else {
		console.log('failed to log in', response);	// TODO: better error handling
	}
}

function getHandles() {
	handles.username = document.querySelector("#log-in-username");
	handles.password = document.querySelector("#log-in-password");
	handles.submit = document.querySelector("#btn-log-in");
}

function addEventListeners() {
	handles.submit.addEventListener('click', postLoginRequest);
}

function onLoad() {
	getHandles();
	addEventListeners();
}

window.addEventListener('load', onLoad);
