const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

describe('## User APIs', () => {
  let user = {
    email: 'KK123@email.com',
    password: '1234567890',
    role: 'Employee',
  };

  describe('# POST /users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/users')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.password).to.equal(user.password);
          expect(res.body.role).to.equal(user.role);
          user = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/users/${user._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.password).to.equal(user.password);
          expect(res.body.role).to.equal(user.role);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/users/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /users/:userId', () => {
    it('should update user details', (done) => {
      user.email = 'KK@email.com';
      request(app)
        .put(`/users/${user._id}`)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.password).to.equal(user.password);
          expect(res.body.role).to.equal(user.role);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /users/', () => {
    it('should get all users', (done) => {
      const query = JSON.stringify({ _id: user._id });
      const select = 'name';
      request(app)
        .get('/users')
        .query({ query, select })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body[0].name).to.equal(user.name);
          expect(res.body[0].email).to.equal(undefined);
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /users/', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/users/${user._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal('KK@email.com');
          expect(res.body.password).to.equal(user.password);
          expect(res.body.role).to.equal(user.role);
          done();
        })
        .catch(done);
    });
  });
});
