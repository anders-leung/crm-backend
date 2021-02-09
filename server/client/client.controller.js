const Client = require('./client.model');
const User = require('../user/user.model');
const Option = require('../option/option.model');

const setupQuery = require('../helpers/setupQuery');


/**
 * Load user and append to req.
 */
const load = (req, res, next, id) => {
  Client.get(id)
    .then((client) => {
      req.client = client; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
};

const newClient = (req, res) => {
  const client = new Client();
  client.phones = [];
  client.children = [];
  client.insurances = [{ beneficiaries: [] }];
  client.employer = {};
  res.json(client);
};

const list = (req, res, next) => {
  const { query, select } = setupQuery(req);
  const find = Client.find(query).populate('services');
  if (select && select.length > 0) find.select(select.join(' '));

  find
    .then((data) => {
      res.json(data);
    })
    .catch(next);
};

const get = (req, res) => res.json(req.client);

const create = (req, res, next) => {
  const { body } = req;
  const { _id } = body;

  Client.findByIdAndUpdate(_id, body, { new: true, upsert: true })
    .then((result) => {
      res.json(result);
    })
    .catch(next);
};

const update = (req, res, next) => {
  const { body, client } = req;
  delete body._id;

  Client.findByIdAndUpdate(client._id, body, { new: true })
    .then((updatedClient) => {
      res.json(updatedClient);
    })
    .catch(next);
};

const remove = (req, res, next) => {
  const { client } = req;
  Client.findByIdAndDelete(client._id)
    .then(() => {
      res.json(client);
    })
    .catch(next);
};

const options = (req, res, next) => {
  const data = {};
  const promises = [
    Client.find(),
    Client.distinct('group'),
    User.find(),
    Option.find(),
  ];

  Promise.all(promises)
    .then(([clients, groups, users, options]) => {
      data.clients = clients.map(client => ({ label: client.clientName, value: client._id }));
      data.groups = groups;
      data.users = users.map(user => ({ label: user.initials, value: user._id }));
      options.forEach((option) => {
        const { _id, name, type } = option;
        const key = `${type.toLowerCase()}s`;
        data[key] = (data[key] || []).concat({ label: name, value: _id });
      });
      res.json(data);
    })
    .catch(next);
};

module.exports = {
  load,
  newClient,
  list,
  get,
  create,
  update,
  remove,
  options,
};
