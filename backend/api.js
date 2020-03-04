const express = require('express'),
	db = require('./database/db.js');

// API router initialization
const apiRouter = new express.Router();
apiRouter.use(express.json());

// Manager initialization
const accountManager = require('./manager/account');
const uniManager = require('./manager/uni');
const reviewManager = require('./manager/review');
const degreeManager = require('./manager/degree');
const searchManager = require('./manager/search');

apiRouter.use('/account', accountManager.router);
apiRouter.use('/uni', uniManager.router);
apiRouter.use('/review', reviewManager.router);
apiRouter.use('/degree', degreeManager.router);
apiRouter.use('/search', searchManager.router);

module.exports = apiRouter;
