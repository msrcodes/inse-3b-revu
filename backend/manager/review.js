const express = require('express'),
  HTTP = require('http-status-codes'),
  db = require('../database/db.js');
  
const router = new express.Router();

//--- Functions
const createReview = (universityName, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview) => {
  return false;
};

const validateReview = (universityName, staffRating, staffReview, facilityRating, facilityReview, universityRating, universityReview, accommodationRating, accommodationReview) => {
  return false;
};

const updateReview = (username) => {

};

const getDegreeReviews = (degreeID) => db.query('SELECT * FROM review WHERE degree_id = $1', [degreeID]);
const getUniversityReviews = (universityID) => db.query('SELECT * FROM review WHERE uni_id = $1', [universityID]);

//--- Routes
router.get('/degree/:ID', async (req, res) => {
  req.params.ID = Number(req.params.ID);
  const reviews = await getDegreeReviews(req.params.ID);
  return res.status(HTTP.OK).send(reviews.rows);
});

router.get('/university/:ID', async (req, res) => {
  req.params.ID = Number(req.params.ID);
  const reviews = await getUniversityReviews(req.params.ID);
  return res.status(HTTP.OK).send(reviews.rows);
});

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