const Joi = require('joi');
const helpers = require('./helpers');
const options = require('./options');
const clients = require('./clients');
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
      email: helpers.emailValidation,
      password: Joi.string().required(),
    },
  },

  // POST /*
  update: model => ({
    body: Joi.object().required(),
    params: {
      [`${model}Id`]: Joi.string().hex().required(),
    },
  }),

  // DELETE /*
  delete: model => ({
    params: {
      [`${model}Id`]: Joi.string().hex().required(),
    },
  }),

  options,
  clients,
  users,
  roles,
};
