const { Pool } = require('pg'),
	config = require('../config/config.json');

const pool = new Pool(config.database);
pool.connect()
	.then(() => console.log('[DATABASE] Successfully connected to the database.'))
	.catch(reason => console.log(`[DATABASE] Unable to connect to the database. Reason: ${reason}`));

module.exports = pool;