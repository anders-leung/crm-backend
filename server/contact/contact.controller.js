const { get: _get, set } = require('lodash');

const Contact = require('./contact.model');

const setupQuery = require('../helpers/setupQuery');

const newClient = (req, res) => {
  const contact = new Contact();
  res.json(contact);
};

const list = (req, res, next) => {
  const { query, select } = setupQuery(req);
  const find = Contact.find(query);
  if (select && select.length > 0) find.select(select);

  find
    .then((data) => {
      res.json(data);
    })
    .catch(next);
};

const load = (req, res, next, id) => {
  Contact.get(id)
    .then((contact) => {
      req.contact = contact; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(next);
};

const get = (req, res) => res.json(req.contact);

const options = (req, res) => {
  const types = Contact.schema.path('category').enumValues.sort();
  const phoneTypes = ['Work', 'Cell', 'Fax', 'Home'];
  const data = { types, phoneTypes };

  res.json(data);
};

const remove = (req, res, next) => {
  const { contact } = req;
  Contact.findByIdAndDelete(contact._id)
    .then(() => res.json(contact))
    .catch(next);
};

const save = (req, res, next) => {
  const { body } = req;

  Contact.findById(body._id)
    .then((contact) => {
      if (!contact) contact = new Contact(); // eslint-disable-line no-param-reassign

      Contact.schema.eachPath((path) => {
        contact.set(path, _get(body, path));
      });
      return contact.save();
    })
    .then((savedContact) => {
      res.json(savedContact);
    })
    .catch(next);
};

const update = (req, res, next) => {
  const { body, contact } = req;

  Object.entries(body).forEach(([path, value]) => {
    set(contact, path, value);
  });

  return contact.save()
    .then((savedContact) => {
      res.json(savedContact);
    })
    .catch(next);
};

module.exports = {
  get,
  list,
  load,
  newClient,
  options,
  remove,
  save,
  update,
};
