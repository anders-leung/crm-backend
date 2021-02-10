const mongoose = require('mongoose');

const getter = require('../helpers/getter');

const Schema = mongoose.Schema;
const ContactSchema = new Schema({
  number: String,
  title: String,
  firstName: String,
  lastName: String,
  company: String,
  name: String,
  address: String,
  phone: String,
  work: String,
  extension: String,
  fax: String,
  cell: String,
  pager: String,
  email: String,
  emails: [{
    emailType: [String],
    address: String,
  }],
  fullAddress: String,
  website: String,
  phones: [{
    phoneType: String,
    extension: String,
    number: String,
  }],
  contact: {
    company: String,
    person: String,
  },
  remarks: String,
  emailed: Date,
  signed: Date,
  category: {
    type: String,
    enum: ['Utilities', 'Financial', 'Cleaning', 'Shredding', 'Repair', 'Lawyer', 'Software', 'Accountant'],
  },
  type: String,
  accountNumber: String,
});

ContactSchema.virtual('attention').get(function () {
  const { name, title, firstName, lastName } = this;

  if (name) {
    return name;
  }

  let string = '';
  string += (title ? `${title} ` : '');
  string += (firstName ? `${firstName} ` : '');
  string += (lastName ? `${lastName} ` : '');

  return string.trim();
});

/**
 * Statics
 */
ContactSchema.statics = {
  get(id) {
    return getter(this, id, []);
  },
};

module.exports = mongoose.model('Contact', ContactSchema);
