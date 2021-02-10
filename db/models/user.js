const { Schema } = require('mongoose');

/**
 * User Schema
 */
module.exports = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
  },
  initials: String,
  emailPassword: String,
  name: String,
  private: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
