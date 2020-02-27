const express = require('express'),
  HTTP = require('http-status-codes'),
  db = require('../database/db.js');
  
const router = new express.Router();

//--- Functions
const createReview = (username) => {

};

const validateReview = (username) => {

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

module.exports = {
	router
};