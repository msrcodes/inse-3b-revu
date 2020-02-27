const db = require('../database/db.js');



const express = require('express');
const router = new express.Router();


router.get('/uniNames', (req, res) => {
	db.query('SELECT uni_name from university').then(dbRes => {
		res.send(dbRes.rows)
	}).catch(() => {
		res.status(500).send();
	})
});


// End url is /uni/:uniId
router.get('/:uniId', (req, res) => {
	const uniId = req.params.uniId;

	db.query('SELECT uni_name, uni_url, uni_description from university where uni_id = $1',
		[uniId]).then(dbRes => {
			if (dbRes.rowCount) {
				res.send(dbRes.rows[0]);
			} else {
				res.status(404).send();
			}
	}).catch(() => {
		res.status(500).send();
	})
});





module.exports = {
	router,
};
