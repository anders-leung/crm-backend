const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');
const verify = require('../tests/verify');
const Option = require('./option.model');

chai.config.includeStack = true;

const paths = [
  'type',
  'name',
  'position',
];

describe.only('## Option APIs', () => {
  let option = {
    type: 'test',
    name: 'TEST SERVICE',
    position: 1,
  };

  const secondOption = {
    type: 'test',
    name: 'SECOND TEST SERVICE',
    position: 1,
  };

  describe('# POST /options', () => {
    it('should create a new option', (done) => {
      request(app)
        .post('/options')
        .send(option)
        .expect(httpStatus.OK)
        .then((res) => {
          verify(res.body, option, paths);
          expect(res.body._id).to.not.equal(undefined);
          option = res.body;
          done();
        })
        .catch(done);
    });

    it('should create a another option', (done) => {
      request(app)
        .post('/options')
        .send(secondOption)
        .expect(httpStatus.OK)
        .then((res) => {
          verify(res.body, secondOption, paths);
          expect(res.body._id).to.not.equal(undefined);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /options/:optionId', () => {
    it('should get option details', (done) => {
      request(app)
        .get(`/options/${option._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          verify(res.body, option, paths);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when option does not exists', (done) => {
      request(app)
        .get('/options/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /options/:optionId', () => {
    it('should update option details', (done) => {
      option.position = 2;
      request(app)
        .put(`/options/${option._id}`)
        .send(option)
        .expect(httpStatus.OK)
        .then((res) => {
          verify(res.body, option, paths);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /options/', () => {
    it('should get all options', (done) => {
      const query = JSON.stringify({ name: option.name });
      request(app)
        .get('/options')
        .query({ query })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.eql(option);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /options/options', () => {
    it('should get frontend options for the options pages', (done) => {
      request(app)
        .get('/options/options')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.types).to.eql(['test']);
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /options/', () => {
    it('should delete option', (done) => {
      request(app)
        .delete(`/options/${option._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          verify(res.body, option, paths);
          done();
        })
        .catch(done);
    });
  });

  after((done) => {
    Option.deleteMany({})
      .then(() => {
        done();
      })
      .catch(done);
  });
});
