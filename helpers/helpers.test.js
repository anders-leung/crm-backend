const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const Client = require('../client/client.model');
const getContactInfo = require('./getContactInfo');
const setupQuery = require('./setupQuery');
const mockClient = require('../tests/mock/client');

chai.config.includeStack = true;

describe('## Internal Helper Functions', () => {
  let client = {};

  before((done) => {
    const newClient = new Client(mockClient);
    newClient.save()
      .then((savedClient) => {
        client = savedClient;
        done();
      })
      .catch(done);
  });

  describe('# getContactInfo', () => {
    it('should return the default email', (done) => {
      const actual = getContactInfo(client);
      expect(actual).to.equal(mockClient.contacts[0].emails[2].address);
      done();
    });

    it('should return the Accounts email', (done) => {
      const actual = getContactInfo(client, 'Accounts');
      expect(actual).to.equal(mockClient.contacts[0].emails[1].address);
      done();
    });

    it('should return the For Sign email', (done) => {
      const actual = getContactInfo(client, 'For Sign');
      expect(actual).to.equal(mockClient.contacts[0].emails[1].address);
      done();
    });

    it('should return the first non Do Not Send email', (done) => {
      delete client.contacts[0].emails[2];
      const actual = getContactInfo(client);
      expect(actual).to.equal(mockClient.contacts[0].emails[1].address);
      done();
    });

    it('should return the first phone number', (done) => {
      const actual = getContactInfo(client, 'Default', 'phone');
      const phone = mockClient.contacts[0].phones[0];
      expect(actual).to.equal(`${phone.number} ext. ${phone.extension}`);
      done();
    });

    it('should return the Cell phone number', (done) => {
      const actual = getContactInfo(client, 'Cell', 'phone');
      const phone = mockClient.contacts[0].phones[2];
      expect(actual).to.equal(`${phone.number} ext. ${phone.extension}`);
      done();
    });
  });

  describe('# setupQuery', () => {
    const reqQuery = {
      in: { $nin: [null, null] },
      $or: [
        {
          't2.toDo': 'CRA Review',
          'invoices.0': { $exists: false },
        },
        {
          't2.toDo': { $ne: 'CRA Review' },
          signed: { $in: [null, null] },
        },
      ],
      'serviceClient.service': 'T2',
    };
    const reqSelect = [
      'test',
      'serviceClient.client.test',
      'serviceClient.client.client.test',
    ];
    const req = {
      query: {
        query: JSON.stringify(reqQuery),
        select: reqSelect.join(' '),
      },
    };

    it('should return the query and the select', (done) => {
      const { query, select, nestedSelect, nestedClientSelect } = setupQuery(req);
      expect(query).to.eql(reqQuery);
      expect(select).to.eql(['test']);
      expect(nestedSelect).to.eql(['test']);
      expect(nestedClientSelect).to.eql(['test']);
      done();
    });
  });

  after((done) => {
    Client.findByIdAndDelete(client._id)
      .then(() => done())
      .catch(done);
  });
});
