const express = require('express'),
	db = require('./database/db.js');

// API router initialization
const router = new express.Router();
router.use(express.json());

// Manager initialization
const accountManager = require('./manager/account');
const reviewManager = require('./manager/review');

router.use('/account', accountManager.router);
router.use('/review', reviewManager.router);

module.exports = router;
