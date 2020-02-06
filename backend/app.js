const express = require('express');
const path = require('path');


const apiRouter = require('./api.js');

const app = express();



function serveApp(req, res) {
	// Using path.join means it works on both linux/mac and windows
	res.sendFile(path.join(__dirname, '../frontend/app.html'));
}


function e404(req, res) {
	res.status(404);
	res.sendFile(path.join(__dirname, '../frontend/errors/404.html'));
}


// The order of the next 3 lines is incredibly important, don't change them
app.use('/static', express.static(path.join(__dirname, '../frontend/static')), e404); // Serve static files to requests on /static, 404 on not found
app.use('/api/v1', apiRouter, e404); // Serve api functions to requests on /api, 404 on not found
app.get('*', serveApp); // Serve SPA html for all other routes, 404 handling is done on the client side


app.listen(3005);  // First free port on the server after 3000
