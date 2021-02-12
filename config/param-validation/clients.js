const Joi = require('joi');
const helpers = require('./helpers');

module.exports = {
  // POST /clients
  save: {
    body: {
      name: helpers.lettersAndSpaceValidation('name'),
      phone: Joi.string(),
      email: helpers.emailValidation,
    },
  },
};
