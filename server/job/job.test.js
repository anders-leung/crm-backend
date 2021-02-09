const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');
const Job = require('./job.model');

chai.config.includeStack = true;

describe('## Job APIs', () => {
  const start = new Date();
  let job = {
    remarks: 'this is a temp test job',
  };

  before((done) => {
    const newJob = new Job(job);
    Job.findByIdAndUpdate(newJob._id, job, { new: true, upsert: true })
      .then((savedJob) => {
        job = savedJob;
        done();
      })
      .catch(done);
  });

  describe('# GET /jobs/', () => {
    it('should get all jobs (matching query and selected fields)', (done) => {
      const query = JSON.stringify({ _id: job._id });
      const select = 'remarks';
      request(app)
        .get('/jobs')
        .query({ query, select })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body[0].remarks).to.eql(job.remarks);
          expect(res.body[0].created).to.equal(undefined);
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /jobs/', () => {
    it('should delete jobs', (done) => {
      request(app)
        .delete(`/jobs/${job._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          const created = new Date(res.body.created);
          expect(created).to.be.greaterThan(start);
          expect(res.body._id).to.equal(job._id.toString());
          expect(res.body.remarks).to.equal(job.remarks);
          expect(res.body.invoices).to.eql([]);
          done();
        })
        .catch(done);
    });
  });

  after((done) => {
    Job.deleteMany({})
      .then(() => done())
      .catch(done);
  });
});
