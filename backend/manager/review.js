/**
 * @namespace manager.review
 * @description Manager that holds api endpoints and functions working with reviews
 */

const express = require('express'),
  HTTP = require('http-status-codes'),
  cookieParser = require('cookie-parser'),
  db = require('../database/db.js'),
  AuthValidation = require('../middleware/auth.validation');

const router = new express.Router();
router.use(cookieParser());

/**
 * @memberOf manager.review
 * @function createReview
 * @param universityID {Number}
 * @param degreeID {Number}
 * @param userID {Number}
 * @param degreeRating {Number}
 * @param degreeReview {String}
 * @param staffRating {Number}
 * @param staffReview {String}
 * @param facilityRating {Number}
 * @param facilityReview {String}
 * @param universityRating {Number}
 * @param universityReview {String}
 * @param accommodationRating {Number}
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
 * @param degreeRating {Number}
 * @param degreeReview {String}
 * @param staffRating {Number}
 * @param staffReview {String}
 * @param facilityRating {Number}
 * @param facilityReview {String}
 * @param universityRating {Number}
 * @param universityReview {String}
 * @param accommodationRating {Number}
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
 * @param degreeID {Number} Degree ID to get all reviews for
 */
const getDegreeReviews = (degreeID) => db.query('SELECT * FROM review WHERE degree_id = $1', [degreeID]);

/**
 * @memberOf manager.review
 * @function getUniversityReviews
 * @param universityID {Number} University ID to get all reviews for
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
const routerPostCreate = async (req, res) => {
  const { universityID, degreeID, degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview } = req.body;

  //--- Validate & create
  if (validateReview(degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview)) {
    await createReview(universityID, degreeID, req.account.user_id, degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview);
    return res.status(HTTP.OK).send();
  }

  return res.status(HTTP.BAD_REQUEST).send();
};
router.post('/create', [AuthValidation.validSessionNeeded, routerPostCreate]);

module.exports = {
	router
};
