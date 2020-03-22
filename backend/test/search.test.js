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





