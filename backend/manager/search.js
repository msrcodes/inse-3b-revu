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
 * @param query.type {String} "uni" or "degree"; Filter for the type to be returned
 * @param query.ucas {Number} The UCAS points required; 0 <= ucas <= 200
 * @param query.category {String} The category of university; Options stated in requirements doc
 * @param query.level {String} The level of study; “All”, “foundation”, “undergraduate”, “postgraduate”
 * @param query.studyType {String} The type of study time; “all”, “part”, “full”
 * @param query.sandwich {String} Whether the course is a sandwich; yes, no, any
 *
 * @return Promise<String>
 */
function getCacheId(query) {
	let id = query.text + query.type +
		query.ucas + query.category +
		query.level + query.studyType +
		query.sandwich; // TODO this better

	return id;
}


/**
 * @memberOf manager.search
 * @func cacheSearchTerm
 * @desc Adds a search term to the cache
 * @param query the query to be added to the cache
 * @param query.text {String} The text the user would like to search for
 * @param query.type {String} "uni" or "degree"; Filter for the type to be returned
 * @param query.ucas {Number} The UCAS points required; 0 <= ucas <= 200
 * @param query.category {String} The category of university; Options stated in requirements doc
 * @param query.level {String} The level of study; “All”, “foundation”, “undergraduate”, “postgraduate”
 * @param query.studyType {String} The type of study time; “all”, “part”, “full”
 * @param query.sandwich {String} Whether the course is a sandwich; yes, no, any
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
 * @param query.type {String} "uni" or "degree"; Filter for the type to be returned
 * @param query.ucas {Number} The UCAS points required; 0 <= ucas <= 200
 * @param query.category {String} The category of university; Options stated in requirements doc
 * @param query.level {String} The level of study; “All”, “foundation”, “undergraduate”, “postgraduate”
 * @param query.studyType {String} The type of study time; “all”, “part”, “full”
 * @param query.sandwich {String} Whether the course is a sandwich; yes, no, any
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
 * @func /
 * @desc Search based on the query, returns list of items
 * @param {Object} req express request object
 * @param req.query the query to be added to the cache
 * @param req.query.text {String} The text the user would like to search for
 * @param req.query.type {String} "uni" or "degree"; Filter for the type to be returned
 * @param req.query.ucas {Number} The UCAS points required; 0 <= ucas <= 200
 * @param req.query.category {String} The category of university; Options stated in requirements doc
 * @param req.query.level {String} The level of study; “All”, “foundation”, “undergraduate”, “postgraduate”
 * @param req.query.studyType {String} The type of study time; “all”, “part”, “full”
 * @param req.query.sandwich {String} Whether the course is a sandwich; yes, no, any
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
	}).catch(() => {
		const results = {test: 1}; // TODO actually get results

		res.send(results);
		cacheSearchTerm(query, results);
	});
});


module.exports = {
	router
};
