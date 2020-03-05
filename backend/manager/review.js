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
 * @param universityID {Integer}
 * @param degreeID {Integer}
 * @param userID {Integer}
 * @param degreeRating {Integer}
 * @param degreeReview {String}
 * @param staffRating {Integer}
 * @param staffReview {String}
 * @param facilityRating {Integer}
 * @param facilityReview {String}
 * @param universityRating {Integer}
 * @param universityReview {String}
 * @param accommodationRating {Integer}
 * @param accommodationReview {String}
 */
const createReview = async (universityID, degreeID, userID, degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview) => {
  await db.query(
    'INSERT INTO review (`uni_id`, `degree_id`, `user_id`, `degree_rating`, `degree_rating_desc`, `staff_rating`, `staff_rating_desc`, `facility_rating`, `facility_rating_desc`, `uni_rating`, `uni_rating_desc`, `accommodation_rating`, `accommodation_rating_desc`) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', 
    [
      universityID,
      degreeID,
      userID,
      degreeRating,
      degreeReview,
      staffRating,
      staffReview,
      facilityRating,
      facilityReview,
      universityRating,
      universityReview,
      accommodationRating,
      accommodationReview
    ]
  );
};

/**
 * @memberOf manager.review
 * @function validateReview
 * @param degreeRating {Integer}
 * @param degreeReview {String}
 * @param staffRating {Integer}
 * @param staffReview {String}
 * @param facilityRating {Integer}
 * @param facilityReview {String}
 * @param universityRating {Integer}
 * @param universityReview {String}
 * @param accommodationRating {Integer}
 * @param accommodationReview {String}
 */
const validateReview = (degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview) => {
  //--- Ratings
  if (
    !Number.isInteger(degreeRating) 
    || !Number.isInteger(staffRating) 
    || !Number.isInteger(facilityRating) 
    || !Number.isInteger(universityRating) 
    || !Number.isInteger(accommodationRating)
  ) return false;

  //--- Desc
  if (
    typeof degreeReview !== typeof ""
    || (typeof staffReview !== typeof "")
    || (typeof facilityReview !== typeof "")
    || (typeof universityReview !== typeof "")
    || (typeof accommodationReview !== typeof "")
  ) return false;
  
  return true;
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
  const { universityID, degreeID, userID, degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview } = req.body;

  //--- TODO: Some sort of user auth

  //--- Validate & create
  if (validateReview(degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview)) {
    await createReview(universityID, degreeID, userID, degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview);
    return res.status(HTTP.OK).send();
  }

  return res.status(HTTP.BAD_REQUEST).send();
});

module.exports = {
	router
};