const Promise = require('bluebird');
const httpStatus = require('http-status');
const mongoose = require('mongoose');

const APIError = require('../helpers/APIError');

const Schema = mongoose.Schema;
const ClientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: String,
  email: String,
  notified: Date,
  dynamic: Object,
});

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
