const mongoose = require('mongoose');

const getter = require('../helpers/getter');
const kyc = require('./types/kyc');
const review = require('./types/review.js');
const insurance = require('./types/insurance');
const purchase = require('./types/purchase');
const meeting = require('./types/meeting');
const stockPurchase = require('./types/stock-purchase');
const fundWatch = require('./types/fund-watch');
const hub = require('./types/hub');

const Schema = mongoose.Schema;
const JobSchema = new Schema({
  // General Info
  created: {
    type: Date,
    default: Date.now,
  },
  cab: String,
  by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'Option',
  },
  whatToDo: {
    type: Schema.Types.ObjectId,
    ref: 'Option',
  },
  meetingDate: Date,
  description: String,
  remarks: String,
  amount: Number,
  gkToDo: String,
  notes: String,
  gkDone: Date,
  followUp: String,
  followUpBy: String,
  done: Date,
  private: Boolean,
  kyc,
  review,
  insurance,
  purchase,
  meeting,
  stockPurchase,
  fundWatch,
  hub,
});

/**
 * Statics
 */
JobSchema.statics = {
  get(id) {
    return getter(this, id, ['client']);
  },
};

/**
 * Hooks
 */
// updateServiceClient(JobSchema);

/**
 * @typedef Job
 */
module.exports = mongoose.model('Job', JobSchema);
