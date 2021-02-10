// TODO: Actually fill in all these validation bodies
const Joi = require('joi');

module.exports = {
  // GET /*
  list: {
    query: {
      query: Joi.string().required(),
      select: Joi.string().allow('').optional(),
    },
  },

  // POST /users
  createUser: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
    },
  },

  // UPDATE /users/:userId
  updateUser: {
    body: Joi.object().required(),
    params: {
      userId: Joi.string().hex().required(),
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

  createService: {
    body: {
      name: Joi.string().required(),
      position: Joi.number().required(),
    },
  },

  createRole: {
    body: {
      name: Joi.string().required(),
      access: Joi.string().required(),
    },
  },
};
