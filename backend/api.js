const express = require('express');

const db = require('./database/db.js');

const router = new express.Router();

router.use(express.json());


router.get('/', (req, res) => {
	res.send({test: "test"})
});

module.exports = router;
