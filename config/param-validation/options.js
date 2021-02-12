const Joi = require('joi');

module.exports = {
  // POST /options
  create: {
    body: {
      name: Joi.string()
        .required()
        .regex(/^[A-z\s]+$/),
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
