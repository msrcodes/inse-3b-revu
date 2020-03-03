/**
 * @namespace manager.account
 * @description Manager that holds api endpoints and functions working with accounts
 */

const express = require('express'),
	cookieParser = require('cookie-parser'),
	bcrypt = require('bcrypt'),
	HTTP = require('http-status-codes'),
	uuidGen = require('uuid'),
	db = require('../database/db.js'),
	mailer = require('../mailer.js');

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const router = new express.Router();
router.use(cookieParser());


/**
 * @memberOf manager.account
 * @func getUser
 * @desc Gets the user details based on their session
 * @param req {Object} express request object
 * @returns {Promise<user>}
 */
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


/**
 * @memberOf manager.account
 * @func /register
 * @desc Register a user
 * @param {Object} req express request object
 * @param {String} req.body.username < 255 chars, unique
 * @param {String} req.body.email < 255 chars, unique
 * @param {String} req.body.password
 * @param {String} req.body.repeatPassword
 * @param {Object} res express response object
 */
router.post('/register', async (req, res) => {
	const { username, email, password, repeatPassword } = req.body;

	if (!email || !password || !repeatPassword)
		return res.status(HTTP.BAD_REQUEST).send({error: "Missing parameters (username, email, password, repeatPassword)."});

	if (repeatPassword !== password)
		return res.status(HTTP.BAD_REQUEST).send({error: "Password does not match with repeat password."});

	if (!EMAIL_REGEX.test(email))
		return res.status(HTTP.BAD_REQUEST).send({error: "Invalid email address."});

	if (!email.endsWith('.ac.uk'))
		return res.status(HTTP.BAD_REQUEST).send({error: "Email must be a valid ac.uk address."});

	try {
		const emailDbRes = await db.query('SELECT email FROM users WHERE email = $1', [email]);
		if (emailDbRes.rowCount > 0)
			return res.status(HTTP.BAD_REQUEST).send({error: "Email already in use."});

		const passwordHash = await bcrypt.hash(password, 10);
		const uuid = uuidGen();

		const insertDbRes = await db.query('INSERT INTO users (username, email, password_hash, verification_token) VALUES ($1, $2, $3, $4)', [username, email, passwordHash, uuid]);
		if (insertDbRes.rowCount) {
			mailer.sendMail(email, "Verify email for REVU",
				`<a href='https://revu.aitken.io/api/v1/account/verify/${uuid}'>Verify your account</a>`,
				`https://revu.aitken.io/api/v1/account/verify/${uuid}`);

			return res.status(HTTP.OK).send();
		}
	} catch (error) {
		console.error(error);
		return res.status(HTTP.INTERNAL_SERVER_ERROR).send();
	}

	return res.status(HTTP.NOT_FOUND).send();
});


/**
 * @memberOf manager.account
 * @func /verify/:token
 * @desc Verify a users email token
 * @param {Object} req express request object
 * @param {String} req.param.token
 * @param {Object} res express response object
 */
router.get('/verify/:token', async (req, res) => {
	const { token } = req.params;

	try {
		let emailDbRes = await db.query('SELECT email FROM users WHERE verification_token = $1', [token]);
		if (emailDbRes.rowCount > 0) {
			await db.query('UPDATE users SET verification_token = NULL, verified = TRUE WHERE email = $1', [emailDbRes.rows[0].email]);
			return res.status(HTTP.MOVED_PERMANENTLY).redirect('/');
		}

		return res.status(HTTP.NOT_FOUND).send({error: "Token not found"});
	} catch (error) {
		console.error(error);
		return res.status(HTTP.INTERNAL_SERVER_ERROR).send();
	}
});


/**
 * @memberOf manager.account
 * @func /login
 * @desc Login a user
 * @param {Object} req express request object
 * @param {String} req.body.email < 255 chars
 * @param {String} req.body.password
 * @param {Object} res express response object
 */
router.post('/login', (req, res) => {
	const { email, password } = req.body;

	getUser(req).then(() => {
		res.status(HTTP.BAD_REQUEST).send('already logged in');
	}).catch(() => {
		db.query('SELECT password_hash, verification_token FROM users WHERE email = $1', [email]).then(dbRes => {
			if (!dbRes.rowCount) {
				res.status(HTTP.BAD_REQUEST).send({error: 'No account exists with that email.'});
				return;
			}
			const account = dbRes.rows[0];

			// Must be verified to login
			if (account.verification_token) {
				res.status(HTTP.INTERNAL_SERVER_ERROR).send({error: 'Account has not been verified.'});
				return;
			}

			bcrypt.compare(password, account.password_hash).then(result => {
				if (result) {
					let uuid = uuidGen();
					res.cookie('session', uuid, {});

					db.query('INSERT INTO user_session VALUES ($1, $2, now())', [email, uuid]).then(dbRes => {
						res.send();
					}).catch(() => {
						res.status(HTTP.INTERNAL_SERVER_ERROR).send();
					});
				} else {
					res.status(HTTP.UNAUTHORIZED).send({error: 'Incorrect email or password.'});
					return;
				}
			})

		});
	});
});


/**
 * @memberOf manager.account
 * @func /loggedIn
 * @desc Check if the user is logged in
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
router.get('/loggedIn', (req, res) => {
	getUser(req)
		.then(() => res.status(HTTP.OK).send({loggedIn: true}))
		.catch(() => res.status(HTTP.UNAUTHORIZED).send());
});

module.exports = {
	router
};
