/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
const Joi = require('joi');

const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

const emailValidation = Joi.string()
  .regex(emailRegex)
  .required()
  .error(errors => errors.map((error) => {
    switch (error.type) {
      case 'any.required':
        return { message: '"email" is required' };
      default:
        return { message: '"email" is not a valid email' };
    }
  }));

const lettersAndSpaceValidation = field => Joi.string()
    .regex(/^[A-z\s]+$/)
    .required()
    .error(errors => errors.map((error) => {
      switch (error.type) {
        case 'any.required':
          return { message: `"${field}" is required` };
        default:
          return { message: `"${field}" can only have letters and spaces` };
      }
    }));

module.exports = {
  emailValidation,
  lettersAndSpaceValidation,
};
