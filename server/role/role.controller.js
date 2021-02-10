const bcrypt = require('bcrypt');
const Role = require('./role.model');
const Job = require('../job/job.model');

const setupQuery = require('../helpers/setupQuery');

const saltRounds = 10;

/**
 * Create new user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
const create = (req, res, next) => {
  const { body } = req;
  const { access } = body;
  const role = new Role(body);
  role.access = access.split(',').map(route => route.trim());

  role.save()
    .then(savedUser => res.json(savedUser))
    .catch(next);
};

/**
 * Get user
 * @returns {User}
 */
const get = (req, res) => res.json(req.user);

/**
 * Get user's jobs.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
const jobs = (req, res, next) => {
  const { user: { _id } } = req;
  const query = {
    $or: [
      { preparer: _id },
      { checker: _id },
      { reviewer: _id },
    ],
  };

  Job.find(query)
    .then(allJobs => res.json(allJobs))
    .catch(e => next(e));
};

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
const list = (req, res, next) => {
  const { query, select } = setupQuery(req);
  const find = Role.find(query);
  if (select && select.length > 0) find.select(select);

  find
    .then(users => res.json(users))
    .catch(e => next(e));
};

/**
 * Load user and append to req.
 */
const load = (req, res, next, id) => {
  Role.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
};

/**
 * Update existing user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.role - The role of user.
 * @returns {User}
 */
const update = (req, res, next) => {
  const { user, body } = req;

  bcrypt.hash(body.password || '', saltRounds)
    .then((hash) => {
      if (body.password) body.password = hash;
      else delete body.password;
      return Role.findByIdAndUpdate(user._id, body, { new: true })
    })
    .then((savedUser) => {
      const result = savedUser.toObject()
      delete result.password; // eslint-disable-line no-param-reassign
      res.json(result);
    })
    .catch(e => next(e));
};

/**
 * Delete user.
 * @returns {User}
 */
const remove = (req, res, next) => {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
};

module.exports = {
  create,
  get,
  jobs,
  list,
  load,
  update,
  remove,
};
