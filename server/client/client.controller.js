const axios = require('axios');
const { get: _get, set } = require('lodash');
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
  let { _id } = body;

  if (!_id) {
    const client = new Client();
    _id = client._id;
  }

  Client.findByIdAndUpdate(_id, body, { new: true, upsert: true })
    .then((result) => {
      res.json(result);
    })
    .catch(next);
};

const update = (req, res, next) => {
  const { body, client } = req;
  delete body._id;

  Object.entries(body).forEach(([key, value]) => set(client, key, value));
  client.validate()
    .then(Client.findByIdAndUpdate(client._id, body, { new: true }))
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
    User.find(),
    Option.find(),
  ];

  Promise.all(promises)
    .then(([users, allOptions]) => {
      data['User Responsible'] = users.map(user => ({ label: user.initials, value: user._id }));
      allOptions.forEach((option) => {
        const { _id, name, type } = option;
        data[type] = (data[type] || []).concat({ label: name, value: _id });
      });
      res.json(data);
    })
    .catch(next);
};

const generatePhoneNumbers = (count) => {
  const max = Math.pow(10, 10);
  const min = Math.pow(10, 9);
  const numbers = [];
  let number;
  // eslint-disable-next-line no-param-reassign, no-plusplus
  while (count-- > 0) {
    number = Math.floor(Math.random() * (max - min)) + min;
    number = number.toString();
    numbers.push(`(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 11)}`);
  }
  return numbers;
};

const generate = (req, res, next) => {
  const numberOfClients = 25;
  const promises = [
    Client.count(),
    axios.get('https://www.randomlists.com/data/names-first.json'),
    axios.get('https://www.randomlists.com/data/names-surnames.json'),
  ];

  Promise.all(promises)
    .then(([clientCount, firstNamesRequest, lastNamesRequest]) => {
      if (clientCount > 1000) return null;
      const firstNames = _get(firstNamesRequest, 'data.data');
      const lastNames = _get(lastNamesRequest, 'data.data');
      const numbers = generatePhoneNumbers(numberOfClients);
      const clients = Array(numberOfClients).fill(0).map((unused, i) => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const client = new Client({
          name: `${firstName} ${lastName}`,
          phone: numbers[i],
          email: `${firstName}.${lastName}@crm-ng.com`.toLowerCase(),
        });
        return client.save();
      });
      return Promise.all(clients);
    })
    .catch((err) => {
      next(err);
    });
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
  generate,
};
