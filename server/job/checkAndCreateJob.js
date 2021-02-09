const httpStatus = require('http-status');

const APIError = require('../helpers/APIError');

module.exports = (Job, job, query, message) => new Promise((resolve, reject) => {
  Job.findOne(query)
    .then((existingJob) => {
      if (existingJob) {
        const err = new APIError(message, httpStatus.CONFLICT, true);
        throw err;
      }
      const update = job.toObject();
      delete update._id;

      return Job.findByIdAndUpdate(job._id, update, { upsert: true, new: true });
    })
    .then(resolve)
    .catch(reject);
});
