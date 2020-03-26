/**
 * @namespace manager.degree
 * @description Manager that holds api endpoints and functions working with degrees
 */

const express = require('express'),
	HTTP = require('http-status-codes'),
	db = require('../database/db.js');

const router = new express.Router();


/**
 * @memberOf manager.degree
 * @function /degree/degreeNames
 * @param req {Object} express request object
 * @param res {Object} express response object
 */
router.get('/degreeNames', (req, res) => {
	db.query('SELECT degree_name, degree_id from degree').then(dbRes => {
		res.send(dbRes.rows)
	}).catch(() => {
		res.status(HTTP.INTERNAL_SERVER_ERROR).send();
	})
});


/**
 * @memberOf manager.degree
 * @function /degree/:degreeId
 * @param req {Object} express request object
 * @param req.params.degreeId {String} The id of the degree to return
 * @param res {Object} express response object
 */
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
