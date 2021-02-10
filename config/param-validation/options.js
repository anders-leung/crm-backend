const Joi = require('joi');

module.exports = {
  // POST /options
  create: {
    body: {
      name: Joi.string().required(),
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
