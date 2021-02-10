const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Role = require('./role.model');
const Job = require('../job/job.model');

const setupQuery = require('../helpers/setupQuery');

const saltRounds = 10;

/**
 * Create new role
 * @property {string} req.body.email - The email of role.
 * @property {string} req.body.mobileNumber - The mobileNumber of role.
 * @returns {role}
 */
const create = (req, res, next) => {
  const { body } = req;
  const { access } = body;
  const role = new Role(body);
  role.access = access.split(',').map(route => route.trim());

  role.save()
    .then(savedrole => res.json(savedrole))
    .catch(next);
};

/**
 * Get role
 * @returns {role}
 */
const get = (req, res) => res.json(req.role);

/**
 * Get role's jobs.
 * @property {number} req.query.skip - Number of roles to be skipped.
 * @property {number} req.query.limit - Limit number of roles to be returned.
 * @returns {role[]}
 */
const jobs = (req, res, next) => {
  const { role: { _id } } = req;
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
 * Get role list.
 * @property {number} req.query.skip - Number of roles to be skipped.
 * @property {number} req.query.limit - Limit number of roles to be returned.
 * @returns {role[]}
 */
const list = (req, res, next) => {
  const { query, select } = setupQuery(req);
  const find = Role.find(query);
  if (select && select.length > 0) find.select(select);

  find
    .then(roles => res.json(roles))
    .catch(e => next(e));
};

/**
 * Load role and append to req.
 */
const load = (req, res, next, id) => {
  Role.get(id)
    .then((role) => {
      if (role._id.toString() === '602358696e1ac0683bfe51bb') {
        throw new APIError('Cannot modify Administrator role', httpStatus.BAD_REQUEST, true);
      }
      req.role = role; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
};

/**
 * Update existing role
 * @property {string} req.body.email - The email of role.
 * @property {string} req.body.password - The password of role.
 * @property {string} req.body.role - The role of role.
 * @returns {role}
 */
const update = (req, res, next) => {
  const { role, body } = req;

  bcrypt.hash(body.password || '', saltRounds)
    .then((hash) => {
      if (body.password) body.password = hash;
      else delete body.password;
      return Role.findByIdAndUpdate(role._id, body, { new: true })
    })
    .then((savedrole) => {
      const result = savedrole.toObject()
      delete result.password; // eslint-disable-line no-param-reassign
      res.json(result);
    })
    .catch(e => next(e));
};

/**
 * Delete role.
 * @returns {role}
 */
const remove = (req, res, next) => {
  const role = req.role;
  role.remove()
    .then(deletedrole => res.json(deletedrole))
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
