const Option = require('./option.model');
const setupQuery = require('../helpers/setupQuery');

/**
 * Create new option
 * @property {string} req.body.name - The name of the option.
 * @property {string} req.body.order - The order of the option.
 * @returns {Service}
 */
const create = (req, res, next) => {
  const option = new Option(req.body);

  option.save()
    .then(savedService => res.json(savedService))
    .catch(next);
};

/**
 * Get option
 * @returns {Service}
 */
const get = (req, res) => {
  res.json(req.option);
};

/**
 * Get option list.
 * @returns {Service[]}
 */
const list = (req, res, next) => {
  const { query } = setupQuery(req);
  const sort = { position: 1 };

  Option.find(query).sort(sort)
    .then(options => res.json(options))
    .catch(next);
};

/**
 * Load option and append to req.
 */
const load = (req, res, next, id) => {
  Option.get(id)
    .then((option) => {
      req.option = option; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(next);
};

/**
 * Load the frontend options.
 */
const options = (req, res, next) => {
  Option.distinct('type')
    .then((types) => {
      types.sort();
      res.json({ types });
    })
    .catch(next);
};

/**
 * Update existing option
 * @property {string} req.body.name - The name of option.
 * @property {string} req.body.order - The order of option.
 * @returns {Service}
 */
const update = (req, res, next) => {
  const { option, body } = req;

  Option.findByIdAndUpdate(option._id, body, { new: true })
    .then(savedService => res.json(savedService))
    .catch(next);
};

/**
 * Delete option.
 * @returns {Service}
 */
const remove = (req, res, next) => {
  const option = req.option;
  option.remove()
    .then(deletedService => res.json(deletedService))
    .catch(next);
};

module.exports = {
  create,
  get,
  list,
  load,
  options,
  update,
  remove,
};
