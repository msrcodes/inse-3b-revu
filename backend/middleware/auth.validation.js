const HTTP = require('http-status-codes'),
      db = require('../database/db.js');

exports.validSessionNeeded = async (req, res, next) => {
  if (req.cookies && req.cookies.session) {

    const token = req.cookies.session;
    const response = await db.query('SELECT * FROM users INNER JOIN user_session us ON users.email = us.email WHERE token = $1', [token]);

    if (response.rowCount) {
      req.account = response.rows[0];
      next();
      return;
    }
  }

  return res.status(HTTP.UNAUTHORIZED).send();
};
