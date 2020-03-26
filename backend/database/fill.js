/*
 * Database fill script, run using npm run setup.
 */

const db = require('./db.js'),
      fastLoremIpsum = require('fast-lorem-ipsum');

const fillReviews = async () => {
  //--- Get degree IDs
  const degrees = await db.query('SELECT * FROM degree');
  const degreeIDs = [];
  for (const degree of degrees.rows)
    degreeIDs.push(degree.degree_id);

  //--- Get uni IDs
  const universities = await db.query('SELECT * FROM university');
  const uniIDs = [];
  for (const uni of universities.rows)
    uniIDs.push(uni.uni_id);

  //--- Create reviews 
  for (const degree of degreeIDs) {

  }
};

fillReviews();