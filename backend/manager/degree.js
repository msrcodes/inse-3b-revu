const express = require('express'),
	HTTP = require('http-status-codes'),
	db = require('../database/db.js');

const router = new express.Router();

const getDegree = (degreeID) => db.query('SELECT * FROM degree INNER JOIN uni_degree ud ON degree.degree_id = ud.degree_id WHERE degree.degree_id = $1', [degreeID]);

router.get('/degreeInfo/:ID', async (req, res) => {
	req.params.ID = Number(req.params.ID);

	const degree = await getDegree(req.params.ID);

	if(degree.rowCount) {
		return res.status(HTTP.OK).send(degree.rows[0]);
	}

	return res.status(HTTP.BAD_REQUEST).send("No degree exists with that ID.");
});

module.exports = {
	router
};
