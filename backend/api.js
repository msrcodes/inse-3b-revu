const express = require('express'),
	db = require('./database/db.js');

// API router initialization
const router = new express.Router();
router.use(express.json());

// Manager initialization
const accountManager = require('./manager/accountManager');
router.use('/account', accountManager.router);

module.exports = router;
