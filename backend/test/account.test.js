const fetch = require('node-fetch');


test('tests user registration, correct', () => {
	return fetch('http://localhost:3005/api/v1/account/login', {
		method: 'POST',
		body: JSON.stringify({email: 'testuser@myport.ac.uk', password: 'password'}),
		headers: { 'Content-Type': 'application/json' },
	}).then(res => {

		if (res.ok) {
			expect(res.headers.raw()['set-cookie']).not.toBe([]);

		} else {
			expect(res.ok).toBe(true);

		}
	})
});


test('tests user registration, correct email incorrect pw', () => {
	return fetch('http://localhost:3005/api/v1/account/login', {
		method: 'POST',
		body: JSON.stringify({email: 'testuser@myport.ac.uk', password: 'notcorrect'}),
		headers: { 'Content-Type': 'application/json' },
	}).then(res => {
		expect(res.status).toBe(401);
	})
});


test('tests user registration, incorrect email', () => {
	return fetch('http://localhost:3005/api/v1/account/login', {
		method: 'POST',
		body: JSON.stringify({email: 'nonexistant@myport.ac.uk', password: 'doesntmatter'}),
		headers: { 'Content-Type': 'application/json' },
	}).then(res => {
		expect(res.status).toBe(400);
	})
});


test('tests user registration, missing email', () => {
	return fetch('http://localhost:3005/api/v1/account/login', {
		method: 'POST',
		body: JSON.stringify({password: 'doesntmatter'}),
		headers: { 'Content-Type': 'application/json' },
	}).then(res => {
		expect(res.status).toBe(400);
	})
});


test('tests user registration, missing pw', () => {
	return fetch('http://localhost:3005/api/v1/account/login', {
		method: 'POST',
		body: JSON.stringify({email: 'doesntmatter'}),
		headers: { 'Content-Type': 'application/json' },
	}).then(res => {
		expect(res.status).toBe(400);
	})
});
