const express = require('express'),
	path = require('path'),
	config = require('./config/config.json'),
	apiRouter = require('./api.js');

const app = express();

function e404(req, res) {
	res.status(404);
	res.sendFile(path.join(__dirname, '../frontend/errors/404.html'));
}

// Routes
app.use('/static', express.static(path.join(__dirname, '../frontend/static')), e404); // Serve static files to requests on /static, 404 on not found
app.use('/api/v1', apiRouter, e404); // Serve api functions to requests on /api, 404 on not found
app.use(express.static(path.join(__dirname, '../frontend')));

// Express server listen
const port = config.port || 3005;
app.listen(port);

console.log(`[BACKEND] Listening on port ${port}.`);
