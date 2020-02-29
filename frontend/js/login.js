'use strict';

const handles = {};

function getFormData() {
	return {
		"email": handles.email.value,
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
		window.location = "/profile";
	} else {
		console.log('failed to log in', response);	// TODO: better error handling
	}
}

function getHandles() {
	handles.email = document.querySelector("#email");
	handles.password = document.querySelector("#password");
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
