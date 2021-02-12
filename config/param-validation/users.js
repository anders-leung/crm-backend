const Joi = require('joi');
const helpers = require('./helpers');

module.exports = {
  // POST /users
  create: {
    body: {
      email: helpers.emailValidation,
      password: Joi.string().required(),
      role: Joi.string().hex().required(),
      name: helpers.lettersAndSpaceValidation('name'),
      initials: Joi.string().required(),
    },
  },

  // PUT /users/:userId
  update: {
    body: Joi.object().required(),
    params: {
      userId: Joi.string().hex().required(),
    },
  },

  // DELETE /users/:userId
  delete: {
    params: {
      userId: Joi.string().hex().required(),
    },
  },
};
