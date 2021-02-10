const bcrypt = require('bcrypt');
const User = require('./user.model');
const Role = require('../role/role.model');
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
  const user = new User(body);

  user.save()
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
  const find = User.find(query).populate('role');
  if (select && select.length > 0) find.select(select);

  find
    .then(users => res.json(users))
    .catch(e => next(e));
};

/**
 * Load user and append to req.
 */
const load = (req, res, next, id) => {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
};

const options = (req, res, next) => {
  const data = {};

  Role.find()
    .then((roles) => {
      data.roles = roles.map(role => ({ label: role.name, value: role._id }));
      res.json(data);
    })
    .catch(next);
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
  const password = body.password || body.emailPassword || '';

  bcrypt.hash(password, saltRounds)
    .then((hash) => {
      if (body.password) body.password = hash;
      else delete body.password;
      return User.findByIdAndUpdate(user._id, body, { new: true });
    })
    .then((savedUser) => {
      const result = savedUser.toObject();
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
  options,
  update,
  remove,
};
