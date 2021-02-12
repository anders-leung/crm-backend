const Joi = require('joi');
const helpers = require('./helpers');

module.exports = {
  // POST /options
  create: {
    body: {
      name: helpers.lettersAndSpaceValidation('name'),
      position: Joi.number().required(),
    },
  },

  // PUT /options/:optionId
  update: {
    body: Joi.object().required(),
    params: {
      roleId: Joi.string().hex().required(),
    },
  },

  // DELETE /options/:optionId
  delete: {
    params: {
      optionId: Joi.string().hex().required(),
    },
  },
};
