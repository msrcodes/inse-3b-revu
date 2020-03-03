/**
 * @namespace manager.review
 * @description Manager that holds api endpoints and functions working with reviews
 */

const express = require('express'),
  HTTP = require('http-status-codes'),
  db = require('../database/db.js');
  
const router = new express.Router();

/**
 * @memberOf manager.review
 * @function createReview
 * @param universityName {String}
 * @param staffRating {String}
 * @param staffReview {String}
 * @param facilityRating {String}
 * @param facilityReview {String}
 * @param universityRating {String}
 * @param universityReview {String}
 * @param accommodationRating {String}
 * @param accommodationReview {String}
 */
const createReview = (universityName, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview) => {
  //--- TODO
  return false;
};

/**
 * @memberOf manager.review
 * @function validateReview
 * @param universityName {String}
 * @param staffRating {String}
 * @param staffReview {String}
 * @param facilityRating {String}
 * @param facilityReview {String}
 * @param universityRating {String}
 * @param universityReview {String}
 * @param accommodationRating {String}
 * @param accommodationReview {String}
 */
const validateReview = (universityName, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview) => {
  //--- TODO
  return false;
};

const updateReview = (username) => {
  //--- TODO
};

/**
 * @memberOf manager.review
 * @function getDegreeReviews
 * @param degreeID {Integer} Degree ID to get all reviews for
 */
const getDegreeReviews = (degreeID) => db.query('SELECT * FROM review WHERE degree_id = $1', [degreeID]);

/**
 * @memberOf manager.review
 * @function getUniversityReviews
 * @param universityID {Integer} University ID to get all reviews for
 */
const getUniversityReviews = (universityID) => db.query('SELECT * FROM review WHERE uni_id = $1', [universityID]);

/**
 * @memberOf manager.review
 * @function /degree/:ID
 * @param req {Object} express request object
 * @param res {Object} express response object
 */
router.get('/degree/:ID', async (req, res) => {
  req.params.ID = Number(req.params.ID);
  const reviews = await getDegreeReviews(req.params.ID);
  return res.status(HTTP.OK).send(reviews.rows);
});

/**
 * @memberOf manager.review
 * @function /university/:ID
 * @param req {Object} express request object
 * @param res {Object} express response object
 */
router.get('/university/:ID', async (req, res) => {
  req.params.ID = Number(req.params.ID);
  const reviews = await getUniversityReviews(req.params.ID);
  return res.status(HTTP.OK).send(reviews.rows);
});

/**
 * @memberOf manager.review
 * @function /create
 * @param req {Object} express request object
 * @param res {Object} express response object
 */
router.post('/create', async (req, res) => {
  const { universityName, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview } = req.body;

  //--- Validate & create
  if (validateReview(universityName, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview)) {
    await createReview(universityName, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview);
    return res.status(HTTP.OK).send();
  }

  return res.status(HTTP.BAD_REQUEST).send();
});

module.exports = {
	router
};