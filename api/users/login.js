const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const db = require('../../db');

/**
 * Returns jwt token if valid email and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = (req, res, next) => {
  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  const { body: { email, password } } = req;
  const query = { email };

  db('User')
    .then(model => model.findOne(query))
    .then((user) => {
      if (!user) throw err;
      const promises = [user, bcrypt.compare(password, user.password)];
      return Promise.all(promises);
    })
    .then(([user, match]) => {
      if (!match) throw err;
      res.json(user);
    })
    .catch(next);
};
