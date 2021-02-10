const Joi = require('joi');

module.exports = {
  // POST /roles
  create: {
    body: {
      name: Joi.string().required(),
      access: Joi.string().required(),
    },
  },

  // PUT /roles/:roleId
  update: {
    body: Joi.object().required(),
    params: {
      roleId: Joi.string().hex().required(),
    },
  },

  // DELETE /roles/:roleId
  delete: {
    params: {
      roleId: Joi.string().hex().required(),
    },
  },
};
