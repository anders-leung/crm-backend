const mongoose = require('mongoose');
const { mongo: { host } } = require('../config/config');
const models = require('./models');

let connection;

module.exports = (model) => {
  let promise = new Promise(resolve => resolve());

  if (!connection) {
    promise = mongoose.createConnection(host, {
      useNewUrlParser: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
    });
  }

  return new Promise((resolve, reject) => {
    promise
      .then((conn) => {
        if (conn) {
          connection = conn;
          connection.model(model, models[model]);
        }
        resolve(connection.model(model));
      })
      .catch(reject);
  });
};
