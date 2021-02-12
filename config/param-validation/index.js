const Joi = require('joi');
const options = require('./options');
const users = require('./users');
const roles = require('./roles');

// eslint-disable-next-line no-useless-escape, max-len
const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

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
      email: Joi.string()
        .regex(emailRegex)
        .required()
        .error(errors => errors.map((error) => {
          switch (error.type) {
            case 'any.required':
              return { message: '"email" is required' };
            default:
              return { message: '"email" is not a valid email' };
          }
        })),
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
