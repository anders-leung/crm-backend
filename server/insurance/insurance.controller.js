const { set } = require('lodash');

const Client = require('../client/client.model');
const Option = require('../option/option.model');

/**
 * Load user and append to req.
 */
const load = (req, res, next, id) => {
  Client.findOne({ 'insurances._id': id })
    .then((client) => {
      req.client = client; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
};

const list = (req, res, next) => {
  const aggregates = [
    {
      $project: {
        insurances: 1,
        name: 1,
        client: 1,
        spouse: 1,
      },
    }, {
      $unwind: {
        path: '$insurances',
      },
    }, {
      $lookup: {
        from: 'options',
        localField: 'insurances.term',
        foreignField: '_id',
        as: 'insurances.term',
      },
    },
  ];

  Client.aggregate(aggregates)
    .then((insurances) => {
      const data = insurances.map((client) => {
        const obj = { ...client };
        obj._id = client.insurances._id;
        obj.clientId = client._id;
        obj.insurances.term = client.insurances.term[0];
        return obj;
      });
      res.json(data);
    })
    .catch(next);
};

const get = (req, res) => res.json(req.client.insurances);

const create = (req, res, next) => {
  const { client, body } = req;
  const update = {
    [`insurances.${client.insurances.length}`]: body,
  };

  Client.findByIdAndUpdate(client._id, update, { upsert: true })
    .then((result) => {
      res.json(result);
    })
    .catch(next);
};

const update = (req, res, next) => {
  const { body, client, params: { insuranceId } } = req;
  const [[key, value]] = Object.entries(body);
  const path = key.split('insurances.')[1];

  client.insurances.forEach((insurance) => {
    if (insurance._id.toString() === insuranceId) {
      set(insurance, path, value);
    }
  });

  client.save()
    .then((data) => {
      res.send(data);
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

  Option.distinct('type')
    .then((types) => {
      data.types = types;
      const promises = types.map(type => Option.list(type));
      return Promise.all(promises);
    })
    .then((results) => {
      data.types.forEach((type, i) => {
        const values = results[i].map((value) => {
          const { _id, name } = value;
          return { label: name, value: _id };
        });
        data[`${type.toLowerCase()}s`] = values;
      });
      res.json(data);
    })
    .catch(next);
};

module.exports = {
  load,
  list,
  get,
  create,
  update,
  remove,
  options,
};
