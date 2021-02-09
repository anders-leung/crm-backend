const Client = require('../client/client.model');

const updateClient = (schema) => {
  schema.pre('save', function (next) {
    const { client } = this;
    const update = client.toObject();
    delete update._id;
    Client.findByIdAndUpdate(client._id, update)
      .then(() => next())
      .catch(next);
  });
};

module.exports = {
  updateClient,
};
