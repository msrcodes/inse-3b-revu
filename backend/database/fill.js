/*
 * Database fill script, run using npm run setup.
 */

const db = require('./db.js'),
      fastLoremIpsum = require('fast-lorem-ipsum');

const selectRandomArray = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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

  //--- Get user IDs
  const users = await db.query('SELECT * FROM users');
  const usersIDs = [];
  for (const user of users.rows)
    usersIDs.push(user.user_id);

  let totalReviews = 0;
  let startTime = Date.now();

  //--- Create reviews for degrees
  for (const degreeID of degreeIDs) {
    await db.query(
      'INSERT INTO review (uni_id, degree_id, user_id, degree_rating, degree_rating_desc, staff_rating, staff_rating_desc, facility_rating, facility_rating_desc, uni_rating, uni_rating_desc, accommodation_rating, accommodation_rating_desc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      [
        selectRandomArray(uniIDs),
        degreeID,
        selectRandomArray(usersIDs),
        getRandomInt(1, 5),
        fastLoremIpsum(getRandomInt(100, 240), 'c'),
        getRandomInt(1, 5),
        fastLoremIpsum(getRandomInt(100, 240), 'c'),
        getRandomInt(1, 5),
        fastLoremIpsum(getRandomInt(100, 240), 'c'),
        getRandomInt(1, 5),
        fastLoremIpsum(getRandomInt(100, 240), 'c'),
        getRandomInt(1, 5),
        fastLoremIpsum(getRandomInt(100, 240), 'c'),
      ]
    );

    totalReviews++;
  }

  //--- Create reviews for unis
  for (const uniID of uniIDs) {
    await db.query(
      'INSERT INTO review (uni_id, degree_id, user_id, degree_rating, degree_rating_desc, staff_rating, staff_rating_desc, facility_rating, facility_rating_desc, uni_rating, uni_rating_desc, accommodation_rating, accommodation_rating_desc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      [
        uniID,
        selectRandomArray(degreeIDs),
        selectRandomArray(usersIDs),
        getRandomInt(1, 5),
        fastLoremIpsum(getRandomInt(100, 240), 'c'),
        getRandomInt(1, 5),
        fastLoremIpsum(getRandomInt(100, 240), 'c'),
        getRandomInt(1, 5),
        fastLoremIpsum(getRandomInt(100, 240), 'c'),
        getRandomInt(1, 5),
        fastLoremIpsum(getRandomInt(100, 240), 'c'),
        getRandomInt(1, 5),
        fastLoremIpsum(getRandomInt(100, 240), 'c'),
      ]
    );

    totalReviews++;
  }

  //--- Finish
  let timeTaken = Date.now() - startTime;
  console.log(`Created ${totalReviews} reviews in ${timeTaken}ms`);
};

fillReviews();