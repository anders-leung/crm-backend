const Joi = require('joi');

module.exports = {
  // POST /users
  create: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().hex().required(),
      name: Joi.string().required(),
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
