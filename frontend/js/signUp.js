'use strict';

const handles = {};

function getFormData() {
	return {
		"username": handles.username.value,
		"email": handles.email.value,
		"password": handles.password.value,
		"repeatPassword": handles.confirmpassword.value,
	};
}

async function postSignUpRequest() {
	const payload = getFormData();

	const response = await fetch('api/v1/account/register', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(payload),
	});

	if (response.ok) {
		// redirect to "check your email" page
		window.location = "/registerSuccess";
	} else {
		console.log('failed to sign up', response);
	}
}

function getHandles() {
	handles.username = document.querySelector("#username");
	handles.email = document.querySelector("#email");
	handles.password = document.querySelector("#password");
	handles.confirmpassword = document.querySelector("#confirm-password");
	handles.signupbutton = document.querySelector("#btn-sign-up");
}

function addEventListeners() {
	handles.signupbutton.addEventListener('click', postSignUpRequest);
}

function onLoad() {
	getHandles();
	addEventListeners();
}

window.addEventListener('load', () => onLoad());
