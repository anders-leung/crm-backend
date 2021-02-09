const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');
const constants = require('./constants');
const verify = require('../tests/verify');
const mockClient = require('../tests/mock/client');

chai.config.includeStack = true;

const paths = [
  'name',
  'address.street',
  'address.city',
  'address.province',
  'address.postalCode',
  'address.country',
  'remarks',
  'contacts.0.firstName',
  'contacts.0.lastName',
  ['contacts.0.emails.0.emailType'],
  'contacts.0.emails.0.address',
  ['contacts.0.emails.1.emailType'],
  'contacts.0.emails.1.address',
  ['contacts.0.emails.2.emailType'],
  'contacts.0.emails.2.address',
  ['contacts.0.phones.0.phoneType'],
  'contacts.0.phones.0.number',
  'contacts.0.phones.0.extension',
];

describe('## Client APIs', () => {
  let client = { ...mockClient };

  describe('# GET /clients/options', () => {
    it('should return the options required for the front end client pages', (done) => {
      request(app)
        .get('/clients/options')
        .then((res) => {
          expect(res.body.statuses).to.eql(constants.statuses);
          expect(res.body.types).to.eql(constants.types);
          expect(res.body.phoneTypes).to.eql(constants.phoneTypes);
          expect(res.body.industries).to.eql(constants.industries);
          expect(res.body.services).to.be.an('array');
          expect(res.body.groups).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /clients/newClient', () => {
    it('should return a blank new client with defaults set', (done) => {
      request(app)
        .get('/clients/newClient')
        .expect(httpStatus.OK)
        .then((res) => {
          const { client: newClient, invoices } = res.body;
          expect(newClient.contacts.length).to.equal(1);
          expect(newClient.contacts[0].phones).to.eql([]);
          expect(invoices.length).to.equal(0);
          client._id = newClient._id;
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /clients', () => {
    it('should create a new client', (done) => {
      request(app)
        .post('/clients')
        .send(client)
        .expect(httpStatus.OK)
        .then((res) => {
          verify(res.body, client, paths);
          client = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /clients/:clientId', () => {
    it('should get client details', (done) => {
      request(app)
        .get(`/clients/${client._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          const { client: returnedClient } = res.body;
          verify(returnedClient, client, paths);
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /clients/:clientId', () => {
    it('should update client details', (done) => {
      client.name = 'KK@ben-cpa.com';
      request(app)
        .put(`/clients/${client._id}`)
        .send(client)
        .expect(httpStatus.OK)
        .then((res) => {
          verify(res.body, client, paths);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /clients/', () => {
    it('should get all clients (matching query and selected fields)', (done) => {
      const query = JSON.stringify({ name: client.name });
      const select = 'name';
      request(app)
        .get('/clients')
        .query({ query, select })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body[0].name).to.equal(client.name);
          expect(res.body[0].remarks).to.equal(undefined);
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /clients/', () => {
    it('should delete client', (done) => {
      request(app)
        .delete(`/clients/${client._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          verify(res.body, client, paths);
          done();
        })
        .catch(done);
    });
  });
});
