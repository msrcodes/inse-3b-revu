const express = require('express'),
	cookieParser = require('cookie-parser'),
	bcrypt = require('bcrypt'),
	uuidGen = require('uuid'),
	db = require('../database/db.js'),
	mailer = require('../mailer.js');

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const router = new express.Router();
router.use(cookieParser());

function getUser(req) {
	return new Promise((resolve, reject) => {
		const token = req.cookies.session;

		db.query('SELECT * FROM users INNER JOIN user_session us ON users.email = us.email WHERE token = $1', [token]).then(dbRes => {
			if (dbRes.rowCount) {
				resolve(dbRes.rows[0]);
			}

			reject();
		})
	})
}

router.post('/register', async (req, res) => {
	const { email, password, repeatPassword } = req.body;

	if (!email || !password || !repeatPassword)
		return res.status(400).send({error: "Missing parameters (email, password, repeatPassword)."});

	if (repeatPassword !== password)
		return res.status(400).send({error: "Password does not match with repeat password."});

	if (!EMAIL_REGEX.test(email))
		return res.status(400).send({error: "Invalid email address."});

	if (!email.endsWith('.ac.uk'))
		return res.status(400).send({error: "Email must be a valid ac.uk address."});

	try {
		const emailDbRes = await db.query('SELECT email FROM users WHERE email = $1', [email]);
		if (emailDbRes.rowCount > 0)
			return res.status(400).send({error: "Email already in use."});

		const passwordHash = await bcrypt.hash(password, 10);
		const uuid = uuidGen();

		const insertDbRes = await db.query('INSERT INTO users (email, password_hash, verification_token) VALUES ($1, $2, $3)', [email, passwordHash, uuid]);
		if (insertDbRes.rowCount) {
			mailer.sendMail(email, "Verify email for REVU",
				`<a href='https://revu.aitken.io/api/v1/account/verify/${uuid}'>Verify your account</a>`,
				`https://revu.aitken.io/api/v1/account/verify/${uuid}`);

			return res.status(200).send();
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send();
	}

	return res.status(404).send();
});

router.get('/verify/:token', async (req, res) => {
	const { token } = req.params;

	try {
		let emailDbRes = await db.query('SELECT email FROM users WHERE verification_token = $1', [token]);
		if (emailDbRes.rowCount > 0) {
			await db.query('UPDATE users SET verification_token = NULL, verified = TRUE WHERE email = $1', [emailDbRes.rows[0].email]);
			return res.status(301).redirect('/');
		}

		return res.status(404).send({error: "Token not found"});
	} catch (error) {
		console.error(error);
		return res.status(500).send();
	}
});

router.post('/login', (req, res) => {
	const { email, password } = req.body;

	getUser(req).then(() => {
		res.status(400).send('already logged in');
	}).catch(() => {
		db.query('SELECT password_hash, verification_token FROM users WHERE email = $1', [email]).then(dbRes => {
			if (!dbRes.rowCount) {
				res.status(400).send({error: 'No account exists with that email.'});
				return;
			}
			const account = dbRes.rows[0];

			// Must be verified to login
			if (account.verification_token) {
				res.status(401).send({error: 'Account has not been verified.'});
				return;
			}

			bcrypt.compare(password, account.password_hash).then(result => {
				if (result) {
					let uuid = uuidGen();
					res.cookie('session', uuid, {});

					db.query('INSERT INTO user_session VALUES ($1, $2, now())', [email, uuid]).then(dbRes => {
						res.send();
					}).catch(() => {
						res.status(500).send();
					});
				} else {
					res.status(401).send({error: 'Incorrect email or password.'});
					return;
				}
			})

		});
	});
});

router.get('/loggedIn', (req, res) => {
	getUser(req)
		.then(() => res.status(200).send({loggedIn: true}))
		.catch(() => res.status(200).send({loggedIn: false}));
});

module.exports = {
	router
};
