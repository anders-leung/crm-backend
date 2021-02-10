const db = require('../../db');

/**
 * Returns all users
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = (req, res, next) => {
  const { query } = req;

  db('User')
    .then(model => model.find(query).select('email'))
    .then((users) => {
      res.json(users);
    })
    .catch(next);
};
