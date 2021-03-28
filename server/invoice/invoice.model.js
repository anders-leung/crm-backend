const mongoose = require('mongoose');

const getter = require('../helpers/getter');

const Schema = mongoose.Schema;
const InvoiceSchema = new Schema({
  company: String,
  issueDate: Date,
  issuedBy: String,
  gst: Number,
  pst: Number,
  total: Number,
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
  services: [{
    service: String,
    description: {
      type: Schema.Types.ObjectId,
      ref: 'Option',
    },
    amount: Number,
    details: String,
    gst: Boolean,
    pst: Boolean,
  }],
  pytReceived: String,
  pytDate: Date,
  number: String,
  remarks: String,
  signDate: Date,
  emailed: {
    when: Date,
    attempt: Number,
  },
});

/**
 * Statics
 */
InvoiceSchema.statics = {
  get(id) {
    return getter(this, id, ['client']);
  },
};

/**
 * @typedef Invoice
 */
module.exports = mongoose.model('Invoice', InvoiceSchema);
