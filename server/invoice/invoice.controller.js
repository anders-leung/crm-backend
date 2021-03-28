/* eslint-disable no-param-reassign */
const fs = require('fs');
const moment = require('moment');
const { get: _get, set, isEmpty } = require('lodash');

const config = require('../../config/config');
const { pytReceived } = require('../helpers/constants');
const { gst, pst } = require('../../config/config');
const Client = require('../client/client.model');
const Invoice = require('../invoice/invoice.model');
const Job = require('../job/job.model');
const Option = require('../option/option.model');
const User = require('../user/user.model');
const setupQuery = require('../helpers/setupQuery');
// const createInvoice = require('./pdf');

const analysis = (req, res, next) => {
  const { query } = setupQuery(req);
  const aggregate = [
    {
      $unwind: {
        path: '$services',
      },
    }, {
      $lookup: {
        from: 'descriptions',
        localField: 'services.description',
        foreignField: '_id',
        as: 'services.description',
      },
    }, {
      $project: {
        'services.description.service': 1,
        'services.amount': 1,
        'services.gst': 1,
        'services.pst': 1,
        issuedBy: 1,
      },
    }, {
      $addFields: {
        amount: {
          $toDouble: '$services.amount',
        },
        total: {
          $add: [
            {
              $toDouble: '$services.amount',
            }, {
              $convert: {
                input: '$services.gst',
                to: 'double',
                onError: 0,
                onNull: 0,
              },
            }, {
              $convert: {
                input: '$services.pst',
                to: 'double',
                onError: 0,
                onNull: 0,
              },
            },
          ],
        },
      },
    }, {
      $group: {
        _id: {
          issuedBy: '$issuedBy',
          service: '$services.description.service',
        },
        amount: {
          $sum: '$amount',
        },
        total: {
          $sum: '$total',
        },
      },
    }, {
      $group: {
        _id: '$_id.issuedBy',
        services: {
          $push: {
            service: '$_id.service',
            total: '$amount',
          },
        },
        total: {
          $sum: '$total',
        },
      },
    },
  ];

  if (!isEmpty(query)) {
    const { company, issueDate: { $gt, $lt } } = query;
    aggregate.unshift(
      {
        $match: {
          company,
          issueDate: {
            $gt: new Date($gt),
            $lt: new Date($lt),
          },
        },
      }
    );
  }

  Invoice.aggregate(aggregate).then((results) => {
    results.forEach((user) => {
      const { services } = user;
      services.forEach((service) => {
        const { service: [name], total } = service;
        user[name] = total;
      });
      delete user.services;
    });
    res.json(results);
  })
    .catch(next);
};

const charts = (req, res, next) => {
  const { query } = setupQuery(req);
  const { company, issueDate: { gt, lt } } = query;
  const aggregates = [
    {
      $match: {
        company,
        issueDate: {
          $gt: new Date(gt),
          $lt: new Date(lt),
        },
      },
    },
    {
      $unwind: {
        path: '$services',
      },
    }, {
      $lookup: {
        from: 'options',
        localField: 'services.description',
        foreignField: '_id',
        as: 'services.description',
      },
    }, {
      $project: {
        'services.description.name': 1,
        'services.amount': 1,
        'services.gst': 1,
        'services.pst': 1,
        issuedBy: 1,
        issueDate: 1,
      },
    }, {
      $addFields: {
        date: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$issueDate',
          },
        },
        amount: {
          $toDouble: '$services.amount',
        },
        total: {
          $add: [
            {
              $toDouble: '$services.amount',
            }, {
              $convert: {
                input: '$services.gst',
                to: 'double',
                onError: 0,
                onNull: 0,
              },
            }, {
              $convert: {
                input: '$services.pst',
                to: 'double',
                onError: 0,
                onNull: 0,
              },
            },
          ],
        },
      },
    }, {
      $group: {
        _id: {
          issueDate: query.chartType === 'pie' ? undefined : '$date',
          service: '$services.description.name',
        },
        amount: {
          $sum: '$amount',
        },
        total: {
          $sum: '$total',
        },
      },
    },
  ];

  if (query.chartType !== 'pie') {
    aggregates.push({
      $group: {
        _id: '$_id.issueDate',
        services: {
          $push: {
            service: '$_id.service',
            total: '$amount',
          },
        },
        total: {
          $sum: '$total',
        },
      },
    });
  }

  Invoice.aggregate(aggregates)
    .then((result) => {
      const labels = [];
      const allData = {};
      let datasets;

      if (query.chartType === 'pie') {
        const data = result.map((entry) => {
          const { _id, total } = entry;
          const service = _get(_id, 'service.0');
          labels.push(service);
          return total;
        });
        datasets = [{ data }];
      } else {
        result.forEach((entry, i) => {
          const { _id, services } = entry;
          const date = moment(_id);
          labels.push(date);
          services.forEach((service) => {
            const { total } = service;
            const [name] = service.service;
            if (!allData[name]) allData[name] = [];
            allData[name][i] = total;
          });
        });
        delete allData.undefined;
        datasets = Object.entries(allData).map(([label, data]) => ({ label, data }));
      }

      res.json({ labels, datasets });
    })
    .catch(next);
};

const newInvoice = (req, res) => {
  const invoice = new Invoice();
  invoice.issueDate = new Date();
  res.json(invoice);
};

const list = (req, res, next) => {
  const { query, select } = setupQuery(req);
  const filteredSelect = select.filter(field => Invoice.schema.paths[field]);
  filteredSelect.push('oneTimeClient', 'services.service', 'services.amount');

  Invoice.find(query).select(filteredSelect.join(' '))
    .populate({
      path: 'client',
      select: 'name',
    })
    .populate('services.description')
    .then((data) => {
      res.json(data);
    })
    .catch(next);
};

const load = (req, res, next, id) => {
  Invoice.get(id)
    .then((invoice) => {
      req.invoice = invoice; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.invoice);

const options = (req, res, next) => {
  const data = {
    pytReceived,
    pst,
    gst,
  };

  Option.list('Service')
    .then((services) => {
      data.services = services;
      return User.public();
    })
    .then((users) => {
      data.users = users.map(user => user.initials);
      res.json(data);
    })
    .catch(next);
};

const remove = (req, res, next) => {
  const { invoice } = req;
  const { company, number } = invoice;
  Invoice.findByIdAndDelete(invoice._id)
    .then(() => fs.unlinkSync(`${config.invoices}/${company}/${number}.pdf`))
    .then(() => res.json(invoice))
    .catch(next);
};

const save = (req, res, next) => {
  const { body } = req;
  const { _id, client, company } = body;

  let invoice;
  let lastNumber;

  const promises = [
    Invoice.findOne({ company }).sort('-number').select('number'),
    Invoice.findById(_id),
  ];

  Promise.all(promises)
    .then(([lastInvoice, invoiceExists]) => {
      if (!invoiceExists) {
        lastNumber = _get(lastInvoice, 'number') || '0';
        lastNumber = parseInt(lastNumber, 10) + 1;
        body.number = lastNumber;
      }
      return Invoice.findByIdAndUpdate(_id, body, { new: true, upsert: true });
    })
    .then((result) => {
      invoice = result;
      if (client) {
        return Client.findById(client);
      }
      return result.oneTimeClient;
    })
    .then((theClient) => {
      // const pdfInvoice = invoice.toJSON();
      // pdfInvoice.client = theClient;
      // return createInvoice(pdfInvoice);
    })
    .then(() => {
      res.json(invoice);
    })
    .catch(next);
};

const update = (req, res, next) => {
  const { body, invoice } = req;
  if (body.pytReceived) body.pytDate = new Date();
  if (body.pytReceived === null) body.pytDate = null;
  if (body.pytDate === null) body.pytReceived = null;

  Object.entries(body).forEach(([path, value]) => {
    set(invoice, path, value);
  });

  invoice.save()
    .then((savedInvoice) => {
      const { pytDate, signDate: signed } = savedInvoice;
      const query = { invoices: invoice._id };
      const jobUpdate = {
        pytDate,
        signed,
      };
      return Job.updateMany(query, jobUpdate);
    })
    .then(() => res.json(invoice))
    .catch(next);
};

module.exports = {
  analysis,
  charts,
  list,
  load,
  get,
  newInvoice,
  options,
  remove,
  save,
  update,
};
