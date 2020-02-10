const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('../database/db.js');
const bcrypt = require('bcrypt');
const uuidGen = require('uuid');



const router = new express.Router();

router.use(cookieParser());

const mailer = require('../mailer.js');

// Routes
router.get('/', (req, res) => {
	res.send('account test');
});


router.post('/register', (req, res) => {
	const {email, password, repeatPassword} = req.body;

	if (!email || !password || !repeatPassword) {
		res.status(400).send({error: "Requires email, password and repeatPassword"});
		return;
	}

	if (repeatPassword !== password) {
		res.status(400).send({error: "Repeat password must match password"});
		return;
	}

	if (!email.endsWith('.ac.uk')) {
		res.status(400).send({error: "Email must end in .ac.uk"});
		return;
	}

	db.query('SELECT email FROM users WHERE email = $1', [email]).then(dbRes => {
		if (dbRes.rowCount) {
			res.status(400).send({"error": "Email already in use"});
		} else {
			bcrypt.hash(password, 10).then(password_hash => {

				const uuid = uuidGen();

				db.query('insert into users (email, password_hash, verification_token) values ($1, $2, $3)', [email, password_hash, uuid]).then(insertRes => {
					if (insertRes.rowCount) {
						mailer.sendMail(email, "Verify email for REVU",
							`<a href='https://revu.aitken.io/api/v1/account/verify/${uuid}'>Verify your account</a>`,
							`https://revu.aitken.io/api/v1/account/verify/${uuid}`);
						res.send();
					} else {
						res.status(500).send();
					}
				}).catch(err => {
					res.status(500).send();
				})

			}).catch(reason => {
				res.status(500).send();
			})
		}
	}).catch(() => {
		res.status(500).send();
	})
});


router.get('/verify/:verifyToken', (req, res) => {
	const verifyToken = req.params.verifyToken;

	db.query('select email from users where verification_token = $1', [verifyToken]).then(selectRes => {
		if (selectRes.rowCount) {
			db.query('update users set verification_token = NULL, verified = TRUE where email = $1', [selectRes.rows[0].email]).then(() => {
				res.send('');
			}).catch(err => {
				res.status(500).send();
			})
		} else {
			res.status(404).send({error: "Token not found"})
		}
	}).catch(err => {
		res.status(500).send();
	});

});


module.exports = {
	router
};
