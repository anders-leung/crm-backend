const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');
const { address } = require('../tests/mock/client');

chai.config.includeStack = true;

/**
 * Helper function to run all the expect lines
 * @param {object} body - Response body
 * @param {Contact} contact - Contact object to verify against response
 */
const verifyContact = (body, contact) => {
  expect(body.name).to.equal(contact.name);
  expect(body.category).to.equal(contact.category);
  expect(body.email).to.equal(contact.email);
  expect(body.website).to.equal(contact.website);
  expect(body.address.street).to.equal(contact.address.street);
  expect(body.address.city).to.equal(contact.address.city);
  expect(body.address.province).to.equal(contact.address.province);
  expect(body.address.postalCode).to.equal(contact.address.postalCode);
  expect(body.address.country).to.equal(contact.address.country);
  expect(body.remarks).to.equal(contact.remarks);
  expect(body.accountNumber).to.equal(contact.accountNumber);
};

describe('## Contact APIs', () => {
  /**
   * Two types of contacts:
   *    - General client contact ie. First, last name, phone numbers etc.
   *    - Company ie. name, general contact
   */
  let contact = {
    name: 'Cleaning Test Company',
    category: 'Cleaning',
    email: 'email@test.com',
    website: 'test website',
    address,
    remarks: 'test remark',
    accountNumber: '123456789',
  };

  describe('# POST /contacts', () => {
    it('should create a new contact', (done) => {
      request(app)
        .post('/contacts')
        .send(contact)
        .expect(httpStatus.OK)
        .then((res) => {
          verifyContact(res.body, contact);
          contact = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /contacts/:contactId', () => {
    it('should get contact details', (done) => {
      request(app)
        .get(`/contacts/${contact._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          verifyContact(res.body, contact);
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /contacts/:contactId', () => {
    it('should update contact details', (done) => {
      contact.name = 'KK@email.com';
      request(app)
        .put(`/contacts/${contact._id}`)
        .send(contact)
        .expect(httpStatus.OK)
        .then((res) => {
          verifyContact(res.body, contact);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /contacts/', () => {
    it('should get all contacts (matching query and selected fields)', (done) => {
      const query = JSON.stringify({ name: contact.name });
      const select = 'name';
      request(app)
        .get('/contacts')
        .query({ query, select })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body[0].name).to.equal(contact.name);
          expect(res.body[0].email).to.equal(undefined);
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /contacts/', () => {
    it('should delete contact', (done) => {
      request(app)
        .delete(`/contacts/${contact._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          verifyContact(res.body, contact);
          done();
        })
        .catch(done);
    });
  });
});
