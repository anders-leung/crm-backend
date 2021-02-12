const Joi = require('joi');

module.exports = {
  // POST /options
  create: {
    body: {
      name: Joi.string().required(),
      position: Joi.number().required(),
    },
  },
};
