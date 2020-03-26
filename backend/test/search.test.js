const fetch = require('node-fetch');


test('Empty string', () => {
	return fetch(`http://localhost:3005/api/v1/search?text=&type=all&ucas=0&category=all&level=all&studyType=all&sandwich=all`, {
		method: 'GET',
	}).then(res => {
		if (res.ok) {
			return res.json().then(json => {
				expect(json).toStrictEqual([])
			})
		} else {
			expect(res.ok).toBe(true);
		}
	})
});


test('Missing parameters', () => {
	return fetch(`http://localhost:3005/api/v1/search`, {
		method: 'GET',
	}).then(res => {
		expect(res.status).toBe(400);
	})
});


describe('UCAS', () => {
	test('Missing parameter', () => {
		return fetch(`http://localhost:3005/api/v1/search?text=e&type=degree&category=all&level=all&studyType=all&sandwich=all`, {
			method: 'GET',
		}).then(res => {
			expect(res.status).toBe(400);
		})
	});


	test('Above range', () => {
		return fetch(`http://localhost:3005/api/v1/search?text=e&type=degree&ucas=201&category=all&level=all&studyType=all&sandwich=all`, {
			method: 'GET',
		}).then(res => {
			expect(res.status).toBe(400);
		})
	});


	test('Below range', () => {
		return fetch(`http://localhost:3005/api/v1/search?text=e&type=degree&ucas=-1&category=all&level=all&studyType=all&sandwich=all`, {
			method: 'GET',
		}).then(res => {
			expect(res.status).toBe(400);
		})
	});


	test('Zero ucas', () => {
		return fetch(`http://localhost:3005/api/v1/search?text=e&type=degree&ucas=0&category=all&level=all&studyType=all&sandwich=all`, {
			method: 'GET',
		}).then(res => {
			if (res.ok) {
				return res.json().then(json => {
					expect(json.length > 0).toBe(true);
				})
			} else {
				expect(res.ok).toBe(true);
			}
		})
	});
});


test('Test past search is added', () => {
	const testText = (Math.random()*10000).toString(32);

	return fetch('http://localhost:3005/api/v1/account/login', {
		method: 'POST',
		body: JSON.stringify({email: 'testuser@myport.ac.uk', password: 'password'}),
		headers: { 'Content-Type': 'application/json' },
	}).then(resLoggedIn => {
		return fetch(`http://localhost:3005/api/v1/search?text=${testText}&type=all&ucas=0&category=all&level=all&studyType=all&sandwich=all`, {
			method: 'GET',
			headers: {
				cookie: resLoggedIn.headers.get('set-cookie'),
			},
		}).then(() => {
			return fetch(`http://localhost:3005/api/v1/account/searches`, {
				method: 'GET',
				headers: {
					cookie: resLoggedIn.headers.get('set-cookie'),
				},
			}).then(async res => {
				const json = await res.json();
				expect(json[0].text).toBe(testText);
			})
		})
	});
});


