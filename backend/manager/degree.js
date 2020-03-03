const express = require('express'),
	HTTP = require('http-status-codes'),
	db = require('../database/db.js');

const router = new express.Router();

router.get('/degreeNames', (req, res) => {
	db.query('SELECT degree_name from degree').then(dbRes => {
		res.send(dbRes.rows)
	}).catch(() => {
		res.status(HTTP.INTERNAL_SERVER_ERROR).send();
	})
});

router.get('/:degreeId', (req, res) => {
	const degreeId = req.params.degreeId;

	db.query('SELECT * FROM degree INNER JOIN uni_degree ud ON degree.degree_id = ud.degree_id WHERE degree.degree_id = $1', [degreeId]).then(dbRes => {
		if (dbRes.rowCount) {
			res.send(dbRes.rows[0]);
		} else {
			res.status(HTTP.NOT_FOUND).send();
		}
	}).catch(() => {
		res.status(HTTP.INTERNAL_SERVER_ERROR).send();
	})
});


module.exports = {
	router
};
