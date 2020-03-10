/**
 * @namespace manager.search
 * @description Manager that holds api endpoints and functions for searching
 */


const express = require('express'),
	HTTP = require('http-status-codes'),
	db = require('../database/db.js');

const router = new express.Router();

const cache = {}; // Const as the pointer to the object will never change


/**
 * @memberOf manager.search
 * @func getCacheId
 * @desc Gets an ID that is unique to that search
 * @param query the query to be added to the cache
 * @param query.text {String} The text the user would like to search for
 * @param query.type {String} "all", "uni" or "degree"; Filter for the type to be returned
 * @param query.ucas {Number} The UCAS points required; 0 <= ucas <= 200
 * @param query.category {String} The category of university; Options stated in requirements doc
 * @param query.level {String} The level of study; “All”, “foundation”, “undergraduate”, “postgraduate”
 * @param query.studyType {String} The type of study time; “all”, “part”, “full”
 * @param query.sandwich {String} Whether the course is a sandwich; yes, no, any
 *
 * @return Promise<String>
 */
function getCacheId(query) {
	return query.text + query.type +
		query.ucas + query.category +
		query.level + query.studyType +
		query.sandwich; // TODO this better
}


/**
 * @memberOf manager.search
 * @func cacheSearchTerm
 * @desc Adds a search term to the cache
 * @param query the query to be added to the cache
 * @param query.text {String} The text the user would like to search for
 * @param query.type {String} "all", "uni" or "degree"; Filter for the type to be returned
 * @param query.ucas {Number} The UCAS points required; 0 <= ucas <= 200; Ucas of 0 is ignored
 * @param query.category {String} The category of university; "all", "business_law", "creative_cultural", "Humanities_Social_Sciences", "technology"
 * @param query.level {String} The level of study; “all”, “foundation”, “undergraduate”, “postgraduate”
 * @param query.studyType {String} The type of study time; “all”, “part”, “full”
 * @param query.sandwich {String} Whether the course is a sandwich; yes, no, all
 * @param results {Array} Array of results
 */
function cacheSearchTerm(query, results) {
	const id = getCacheId(query);
	cache[id] = results;
}


/**
 * @memberOf manager.search
 * @func checkCacheForSearchTerm
 * @desc Checks the cache for a search term
 * @param query the query to be added to the cache
 * @param query.text {String} The text the user would like to search for
 * @param query.type {String} "all", "uni" or "degree"; Filter for the type to be returned
 * @param query.ucas {Number} The UCAS points required; 0 <= ucas <= 200; Ucas of 0 is ignored
 * @param query.category {String} The category of university; "all", "business_law", "creative_cultural", "Humanities_Social_Sciences", "technology"
 * @param query.level {String} The level of study; “all”, “foundation”, “undergraduate”, “postgraduate”
 * @param query.studyType {String} The type of study time; “all”, “part”, “full”
 * @param query.sandwich {String} Whether the course is a sandwich; yes, no, all
 * @return {Object} searchResults object
 */
async function checkCacheForSearchTerm(query) {
	return new Promise(async (resolve, reject)=> {
		const id = getCacheId(query);

		const results = cache[id];
		if (results !== undefined) {
			resolve(results);
		} else {
			reject();
		}
	});
}


/**
 * @memberOf manager.search
 * @func getSearchResults
 * @desc Searches the database for degrees and unis
 * @param query the query to be added to the cache
 * @param query.text {String} The text the user would like to search for
 * @param query.type {String} "all", "uni" or "degree"; Filter for the type to be returned
 * @param query.ucas {Number} The UCAS points required; 0 <= ucas <= 200; Ucas of 0 is ignored
 * @param query.category {String} The category of university; "all", "business_law", "creative_cultural", "Humanities_Social_Sciences", "technology"
 * @param query.level {String} The level of study; “all”, “foundation”, “undergraduate”, “postgraduate”
 * @param query.studyType {String} The type of study time; “all”, “part”, “full”
 * @param query.sandwich {String} Whether the course is a sandwich; yes, no, all
 * @return {Object} searchResults object
 */
async function getSearchResults(query) {
	const {text, type, ucas, category, level, studyType, sandwich} = query;

	let dbQuery = ``;
	let params = [];
	let paramNumber = 1;
	let results = [];

	if (type !== 'degree') {

		dbQuery += `select * from university `;
		if (text) {
			dbQuery += `where uni_name ILIKE $1 `;
			params.push(`%${text}%`);
		}

		dbQuery += `limit 20`;

		let degreeDbRes = await db.query(dbQuery, params);

		results = results.concat(degreeDbRes.rows);

	}

	dbQuery = ``;
	params = [];
	paramNumber = 1;

	if (type !== 'uni') {
		dbQuery += `select u.uni_name, u.uni_id, d.degree_id, d.degree_name, ud.requirements_ucas, ud.requirements_grades, ` +
			`ud.degree_category, ud.degree_level, ud.degree_type, ud.degree_sandwich ` +
			`from uni_degree as ud ` +
			`inner join university as u on ud.uni_id = u.uni_id ` +
			`inner join degree as d on ud.degree_id = d.degree_id `;

		if (text) {
			dbQuery += `where d.degree_name ILIKE $${paramNumber++} `;
			params.push(`%${text}%`);
		}

		if (ucas !== 0) {
			dbQuery += `AND ud.requirements_ucas <= $${paramNumber++} `;
			params.push(ucas);
		}

		if (category !== 'all') {
			dbQuery += `AND ud.degree_category = $${paramNumber++} `;
			params.push(category);
		}

		if (level !== 'all') {
			dbQuery += `AND ud.degree_level = $${paramNumber++} `;
			params.push(level);
		}

		if (studyType !== 'all') {
			dbQuery += `AND ud.degree_type = $${paramNumber++} `;
			params.push(studyType);
		}

		if (sandwich !== 'all') {
			dbQuery += `AND ud.degree_sandwich = $${paramNumber++} `;
			params.push(sandwich);
		}

		dbQuery += `limit 20`;

		let uniDbRes = await db.query(dbQuery, params);

		results = results.concat(uniDbRes.rows);
	}
	return results
}


/**
 * @memberOf manager.search
 * @func /
 * @desc Search based on the query, returns list of items
 * @param {Object} req express request object
 * @param req.query the query to be added to the cache
 * @param req.query.text {String} The text the user would like to search for
 * @param req.query.type {String} "all", "uni" or "degree"; Filter for the type to be returned
 * @param req.query.ucas {Number} The UCAS points required; 0 <= ucas <= 200; Ucas of 0 is ignored
 * @param req.query.category {String} The category of university; "all", "business_law", "creative_cultural", "Humanities_Social_Sciences", "technology"
 * @param req.query.level {String} The level of study; “all”, “foundation”, “undergraduate”, “postgraduate”
 * @param req.query.studyType {String} The type of study time; “all”, “part”, “full”
 * @param req.query.sandwich {String} Whether the course is a sandwich; yes, no, all
 * @param {Object} res express response object
 */
router.get('/', async (req, res) => {
	const query = req.query;
	const {text, type, ucas, category, level, studyType, sandwich} = query;

	if (text === undefined || !(type && ucas && category && level && studyType && sandwich)) {
		return res.status(HTTP.BAD_REQUEST).send('Must have all required query fields');
	}

	if (ucas > 200 || ucas < 0) {
		return res.status(HTTP.BAD_REQUEST).send(`ucas must be between 0 and 200 not ${ucas}`);
	}

	checkCacheForSearchTerm(query).then(results => {
		res.send(results);
	}).catch(async () => {
		const results = await getSearchResults(query); // TODO actually get results

		res.send(results);
		cacheSearchTerm(query, results);
	});
});


module.exports = {
	router
};
