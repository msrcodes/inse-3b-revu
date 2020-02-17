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

	const response = await fetch('register', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(payload),
	});

	if (response.ok) {
		// redirect to "check your email" page
		console.log("success")
	} else {
		console.log('failed to sign up', response);
	}
}

function getHandles() {
	handles.username = document.querySelector("#sign-up-username");
	handles.email = document.querySelector("#sign-up-email");
	handles.password = document.querySelector("#sign-up-password");
	handles.confirmpassword = document.querySelector("#sign-up-confirm-password");
	handles.signupbutton = document.querySelector("#btn-create-account");
}

function addEventListeners() {
	handles.signupbutton.addEventListener('click', postSignUpRequest);
}

function onLoad() {
	getHandles();
	addEventListeners();
}

window.addEventListener('load', () => onLoad());
