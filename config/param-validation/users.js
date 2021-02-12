const Joi = require('joi');
const helpers = require('./helpers');

module.exports = {
  // POST /users
  save: {
    body: {
      email: helpers.emailValidation,
      password: Joi.string().required(),
      role: Joi.string().hex().required(),
      name: helpers.lettersAndSpaceValidation('name'),
      initials: Joi.string().required(),
    },
  },
};
