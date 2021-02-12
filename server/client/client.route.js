const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const clientCtrl = require('./client.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /clients - Get list of clients */
  .get(validate(paramValidation.list), clientCtrl.list)

  /** POST /clients - Create new client */
  .post(validate(paramValidation.clients.save), clientCtrl.create);

router.route('/options')
  /** GET /clients/options - Get client */
  .get(clientCtrl.options);

router.route('/newClient')
  /** GET /clients/newClient */
  .get(clientCtrl.newClient);

router.route('/:clientId')
  /** GET /clients/:clientId - Get client */
  .get(clientCtrl.get)
  /** PUT /clients/:clientId - Update client */
  .put(validate(paramValidation.update('client')), clientCtrl.update)
  /** DELETE /clients/:clientId - Delete client */
  .delete(validate(paramValidation.delete('client')), clientCtrl.remove);

/** Load client when API with clientId route parameter is hit */
router.param('clientId', clientCtrl.load);

module.exports = router;
