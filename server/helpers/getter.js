const httpStatus = require('http-status');

const APIError = require('../helpers/APIError');

module.exports = (schema, id, populates = []) => new Promise((resolve, reject) => {
  const err = new APIError(`No such ${schema.modelName} client exists!`, httpStatus.NOT_FOUND);

  schema.findById(id)
    .exec()
    .then((result) => {
      if (result) return result;
      throw err;
    })
    .then(result => schema.populate(result, populates.join(' ')))
    .then(resolve)
    .catch(reject);
});
