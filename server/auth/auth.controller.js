const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const User = require('../user/user.model');

/**
 * Returns jwt token if valid email and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  const { body: { email, password } } = req;
  const query = { email };

  User.findOne(query)
    .populate('role')
    .then((user) => {
      if (!user) throw err;
      const promises = [user, bcrypt.compare(password, user.password)];
      return Promise.all(promises);
    })
    .then(([user, match]) => {
      if (!match) throw err;
      const { name, initials, role } = user;
      res.json({
        name,
        initials,
        role,
      });
    })
    .catch(next);
}

module.exports = { login };
