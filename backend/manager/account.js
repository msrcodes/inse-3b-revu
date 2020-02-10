const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('../database/db.js');
const bcrypt = require('bcrypt');
const uuidGen = require('uuid');



const router = new express.Router();

router.use(cookieParser());

const mailer = require('../mailer.js');


function getUser(req) {
	return new Promise((resolve, reject)=> {
		const token = req.cookies.session;

		db.query('SELECT * FROM users inner join user_session us on users.email = us.email where token = $1', [token]).then(dbRes => {
			if (dbRes.rowCount) {
				resolve(dbRes.rows[0]);
			} else {
				reject();
			}
		})
	})

}


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
				res.status(301).redirect('https://revu.aitken.io')
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


router.post('/login', (req, res) => {
	const {email, password} = req.body;

	getUser(req).then(() => {
		res.status(400).send('already logged in');
	}).catch(() => {
		db.query('SELECT password_hash, verification_token from users where email = $1', [email]).then(dbRes => {
			if (!dbRes.rowCount) {
				res.status(400).send('Account does not exist.');
				return;
			}
			const account = dbRes.rows[0];

			if (account.verification_token) { // Must be verified to login
				res.status(401).send('Account has not been verified.');
				return;
			}

			bcrypt.compare(password, account.password_hash).then(result => {
				if (result) {
					let uuid = uuidGen();
					res.cookie('session', uuid, {});

					db.query('insert into user_session values ($1, $2, now())', [email, uuid]).then(dbRes => {
						res.send();
					}).catch(() => {
						res.status(500).send();
					});
				} else {
					res.status(401).send('Incorrect password.');
					return;
				}
			})

		});
	});
});


router.get('/loggedIn', (req, res) => {
	getUser(req).then(() => {
		res.status(200).send({loggedIn: true})
	}).catch(() => {
		res.status(200).send({loggedIn: false})
	})
});




module.exports = {
	router
};
