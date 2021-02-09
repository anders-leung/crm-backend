const mongoose = require('mongoose');

const Option = require('./option.model');
mongoose.Promise = require('bluebird');

const services = ['Open', 'JT', 'RRSP', 'SP RRSP', 'RRIF', 'SP RRIF', 'LIF', 'TFSA', 'RESP', 'RDSP'];
const terms = ['Term 10', 'Term 15', 'Term 20', 'Term 35', 'P WL', 'En WL', 'UL'];

if (process.env.NODE_ENV === 'prod') {
  mongoose.connect('mongodb://localhost:27017/ia');

  const promises = [];

  services.forEach((service, i) => {
    const option = new Option({
      type: 'Service',
      name: service,
      position: i + 1,
    });
    promises.push(option.save());
  });

  terms.forEach((term, i) => {
    const option = new Option({
      type: 'Term',
      name: term,
      position: i + 1,
    });
    promises.push(option.save());
  });

  Promise.all(promises)
    .then((result) => {
      console.log(`Added ${result.length} options`);
    })
    .catch((err) => {
      console.log('Error in populating options: ', err);
    });
}
