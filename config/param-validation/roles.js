const Joi = require('joi');

module.exports = {
  // POST /roles
  save: {
    body: {
      name: Joi.string().required(),
      access: Joi.string().required(),
    },
  },
};
