const mongoose = require('mongoose');
const Client = require('../client/client.model');

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092

  Client.deleteMany({})
    .then(() => {
      mongoose.models = {};
      mongoose.modelSchemas = {};
      mongoose.connection.close();
      done();
    })
    .catch(done);
});

