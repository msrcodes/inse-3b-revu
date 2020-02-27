const express = require('express'),
	db = require('./database/db.js');

// API router initialization
const apiRouter = new express.Router();
apiRouter.use(express.json());

// Manager initialization
const accountManager = require('./manager/account');
const reviewManager = require('./manager/review');
const degreeManager = require('./manager/degree');

apiRouter.use('/account', accountManager.router);
apiRouter.use('/review', reviewManager.router);
apiRouter.use('/degree', degreeManager.router);

module.exports = apiRouter;
