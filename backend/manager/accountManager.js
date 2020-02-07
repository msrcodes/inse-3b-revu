const express = require('express')
	db = require('../database/db.js');

const router = new express.Router();

// Exposed functions
function myExposedFunction() {
	return true;
}

// Routes
router.get('/', (req, res) => {
	res.send('accountManager test');
});

module.exports = {
	router,
	myExposedFunction
};