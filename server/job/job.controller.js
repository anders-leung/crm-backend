const Job = require('./job.model');
const Client = require('../client/client.model');

const setupQuery = require('../helpers/setupQuery');
const { get: _get } = require('lodash');

const list = (req, res, next) => {
  const { query, select } = setupQuery(req);
  const find = Job.find(query)
    .populate('client')
    .populate('type');
  if (select && select.length > 0) find.select(select);

  find
    .then((data) => {
      res.json(data);
    })
    .catch(next);
};

const get = (req, res) => res.json(req.job);

const load = (req, res, next, id) => {
  Job.get(id)
    .then((job) => {
      req.job = job; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
};

const remove = (req, res, next) => {
  const { job } = req;

  Job.findByIdAndDelete(job._id)
    .then(() => res.json(job))
    .catch(next);
};

const save = (req, res, next) => {
  const { body } = req;
  const job = new Job(body);

  job.save()
    .then(newJob => Job.findById(newJob._id).populate('client').populate('type'))
    .then((result) => {
      res.json(result);
    })
    .catch(next);
};

const update = (req, res, next) => {
  const { body, job: { _id } } = req;
  let job;

  Job.findByIdAndUpdate(_id, body, { new: true })
    .populate('client')
    .populate('type')
    .then((updatedJob) => {
      job = updatedJob;
      const jobType = _get(job, 'type.name');

      // Update the client Recent KYC value with the KYC Done date
      if (jobType === 'KYC') {
        const { client, done } = updatedJob;
        if (done) return Client.findByIdAndUpdate(client._id, { recentKYC: done });
      }

      return null;
    })
    .then((result) => res.json(result || job))
    .catch(next);
};

module.exports = {
  list,
  load,
  get,
  remove,
  save,
  update,
};
