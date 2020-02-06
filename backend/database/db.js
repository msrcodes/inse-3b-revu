const fs = require('fs');


const {Pool} = require('pg');


let config = require('../config/config.json');

const pool = new Pool(config.database);
pool.connect().catch(reason => {throw reason});

module.exports = {

};
