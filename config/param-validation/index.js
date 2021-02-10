const Joi = require('joi');
const options = require('./options');
const users = require('./users');
const roles = require('./roles');

module.exports = {
  // GET /*
  list: {
    query: {
      query: Joi.required(),
      select: Joi.string().allow('').optional(),
    },
  },

  // POST /auth/login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  },

  // POST /clients
  saveObject: {
    body: Joi.object().required(),
  },

  options,
  users,
  roles,
};
