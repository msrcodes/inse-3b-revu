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
    'INSERT INTO review (uni_id, degree_id, user_id, degree_rating, degree_rating_desc, staff_rating, staff_rating_desc, facility_rating, facility_rating_desc, uni_rating, uni_rating_desc, accommodation_rating, accommodation_rating_desc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
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


const updateReview = async (universityID, degreeID, userID, reviewId, degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview) => {
	await db.query(
		'UPDATE review SET degree_rating = $5, degree_rating_desc = $6, staff_rating = $7, staff_rating_desc = $8, facility_rating = $9, facility_rating_desc = $10, uni_rating = $11, uni_rating_desc = $12, accommodation_rating = $13, accommodation_rating_desc = $14 where uni_id = $1 and degree_id = $2 and user_id = $3 and review_id = $4',
		[
			universityID,
			degreeID,
			userID,
			reviewId,
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
  //--- Desc
  return !(typeof degreeReview !== typeof ""
	  || (typeof staffReview !== typeof "")
	  || (typeof facilityReview !== typeof "")
	  || (typeof universityReview !== typeof "")
	  || (typeof accommodationReview !== typeof ""));
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
 * @function getUserReviews
 * @param userID {Number} User ID to get all reviews for
 */
const getUserReviews = (userID) => db.query('SELECT * FROM review WHERE user_id = $1', [userID]);

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

router.get('/degree/:ID/average', async (req, res) => {
  req.params.ID = Number(req.params.ID);
  const data = await db.query('SELECT AVG(degree_rating) AS avg_degree_rating, AVG(staff_rating) AS avg_staff_rating, AVG(facility_rating) AS avg_facility_rating, AVG(uni_rating) AS avg_uni_rating, AVG(accommodation_rating) AS avg_accommodation_rating FROM review WHERE degree_id = $1', [req.params.ID]);
  return res.status(HTTP.OK).send(data.rows[0]);
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

router.get('/university/:ID/average', async (req, res) => {
  req.params.ID = Number(req.params.ID);
  const data = await db.query('SELECT AVG(degree_rating) AS avg_degree_rating, AVG(staff_rating) AS avg_staff_rating, AVG(facility_rating) AS avg_facility_rating, AVG(uni_rating) AS avg_uni_rating, AVG(accommodation_rating) AS avg_accommodation_rating FROM review WHERE uni_id = $1', [req.params.ID]);
  return res.status(HTTP.OK).send(data.rows[0]);
});

/**
 * @memberOf manager.review
 * @function /user/:ID
 * @param req {Object} express request object
 * @param res {Object} express response object
 */
router.get('/user/:ID', async (req, res) => {
  req.params.ID = Number(req.params.ID);
  const reviews = await getUserReviews(req.params.ID);
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


/**
 * @memberOf manager.review
 * @function /update
 * @param req {Object} express request object
 * @param req.body {Object} json request body
 * @param req.body.universityID {Number}
 * @param req.body.degreeID {Number}
 * @param req.body.degreeRating {Number}
 * @param req.body.degreeReview {String}
 * @param req.body.staffRating {Number}
 * @param req.body.staffReview {String}
 * @param req.body.facilityRating {Number}
 * @param req.body.facilityReview {String}
 * @param req.body.universityRating {Number}
 * @param req.body.universityReview {String}
 * @param req.body.accommodationRating {Number}
 * @param req.body.accommodationReview {String}
 * @param res {Object} express response object
 */
const routerPostUpdate = async (req, res) => {
	const { universityId, degreeId, reviewId, degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview } = req.body;


	//--- Validate & create
	if (validateReview(degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview)) {

		const dbExists = await db.query('SELECT * from review where uni_id = $1 and degree_id = $2 and user_id = $3 and review_id = $4', [universityId, degreeId, req.account.user_id, reviewId]);

		if (dbExists.rowCount) {
			await updateReview(universityId, degreeId, req.account.user_id, reviewId, degreeRating, degreeReview, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview);

			return res.status(HTTP.OK).send({});
		} else {
			res.status(HTTP.NOT_FOUND).send({});
		}
	} else {
		return res.status(HTTP.BAD_REQUEST).send();
	}
};

router.post('/update', [AuthValidation.validSessionNeeded, routerPostUpdate]);

module.exports = {
  router,
  validateReview
};
