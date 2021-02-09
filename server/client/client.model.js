const Promise = require('bluebird');
const httpStatus = require('http-status');
const mongoose = require('mongoose');

const APIError = require('../helpers/APIError');
const Contact = require('../contact/contact.model');

const Schema = mongoose.Schema;

const person = {
  title: String,
  firstName: String,
  lastName: String,
  age: Number,
  dateOfBirth: Date,
  employer: {
    occupation: String,
    name: String,
    address: String,
    phone: String,
    industry: String,
    yearsOfService: Number,
  },
  driversLicense: {
    number: String,
    expiry: Date,
  },
  landDate: Date,
};

const ClientSchema = new Schema({
  client: person,
  spouse: person,
  status: String,
  clientType: {
    type: Schema.Types.ObjectId,
    ref: 'Option',
  },
  group: String,
  phones: [{
    note: String,
    number: String,
  }],
  email: String,
  emails: [{
    note: String,
    address: String,
  }],
  // address: Address.schema,
  address: String,
  newClientDate: Date,
  referBy: String,
  aaDoneDate: Date,
  recentKYC: Date,
  cpp: {
    date: Date,
    amount: Number,
  },
  oas: {
    date: Date,
    amount: Number,
  },
  dependents: [{
    firstName: String,
    lastName: String,
    relationship: String,
    dateOfBirth: Date,
    age: Number,
  }],
  services: [{
    type: Schema.Types.ObjectId,
    ref: 'Option',
  }],
  assets: [Object],
  insurances: [{
    term: {
      type: Schema.Types.ObjectId,
      ref: 'Option',
    },
    policyDate: Date,
    policyNumber: String,
    premium: Boolean,
    adp: Boolean,
    expiry: Date,
    renewal: Boolean,
    insured: Number,
    issueDate: Date,
    anniversaryMonth: String,
    matureDate: Date,
    termRenewal: String,
    ulInvestment: String,
    remarks: String,
    beneficiaries: [{
      name: String,
      sin: String,
      relationship: String,
      percentage: String,
    }],
  }],
});

ClientSchema.virtual('clientName').get(function () {
  const { client } = this;
  let clientName = '';
  if (client.title) clientName = `${client.title} `;
  if (client.firstName) clientName += `${client.firstName} `;
  if (client.lastName) clientName += client.lastName;

  return clientName.trim();
});

ClientSchema.virtual('spouseName').get(function () {
  const { spouse } = this;
  let spouseName = '';
  if (spouse.title) spouseName = `${spouse.title} `;
  if (spouse.firstName) spouseName += `${spouse.firstName} `;
  if (spouse.lastName) spouseName += spouse.lastName;

  return spouseName.trim();
});

ClientSchema.set('toObject', { virtuals: true });
ClientSchema.set('toJSON', { virtuals: true });

/**
 * Statics
 */
ClientSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((client) => {
        if (client) {
          return client;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

/**
 * @typedef Client
 */
module.exports = mongoose.model('Client', ClientSchema);
