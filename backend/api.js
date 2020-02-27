const express = require('express'),
	db = require('./database/db.js');

// API router initialization
const apiRouter = new express.Router();
apiRouter.use(express.json());

// Manager initialization
const accountManager = require('./manager/account');
const reviewManager = require('./manager/review');

apiRouter.use('/account', accountManager.router);
apiRouter.use('/review', reviewManager.router);

module.exports = apiRouter;
