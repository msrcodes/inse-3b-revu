const express = require('express'),
	path = require('path'),
	HTTP = require('http-status-codes'),
	config = require('./config/config.json'),
	apiRouter = require('./api.js');

const app = express();

const errorNotFound = (req, res) => {
	res.status(HTTP.NOT_FOUND);
	res.sendFile(path.join(__dirname, '../frontend/errors/404.html'));
};


// Serve static files to requests on /static, 404 on not found
app.use('/static', express.static(path.join(__dirname, '../frontend/static')), errorNotFound);

// Serve api functions to requests on /api, 404 on not found
app.use('/api/v1', apiRouter, errorNotFound);

// Serve rest of frontend
app.use(express.static(path.join(__dirname, '../frontend'), { extensions: ['html'] }));

//--- Serve jsdoc route if app is in development environment
if (process.env.NODE_ENV === 'development')
	app.use('/doc', express.static(path.join(__dirname, '../out')));


// Express server listen
const port = config.port || 3005;
app.listen(port);

console.log(`[BACKEND] Listening on port ${port}.`);
