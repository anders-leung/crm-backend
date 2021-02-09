const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');

const contactCtrl = require('./contact.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /contacts - Get list of contact */
  .get(validate(paramValidation.list), contactCtrl.list)

  /** POST /contact - Save the Contact client */
  .post(validate(paramValidation.saveContact), contactCtrl.save);

router.route('/newClient')
  /** GET /contacts/newClient - Get a new Contact client object*/
  .get(contactCtrl.newClient);

router.route('/options')
  /** GET /contacts/options - Get Contact options */
  .get(contactCtrl.options);

router.route('/:contactId')
  /** GET /contacts/:contactId - Get Contact client */
  .get(contactCtrl.get)
  /** PUT /contacts/:contactId - Update the Contact client */
  .put(contactCtrl.update)
  /** DELETE /contacts/:contactId - Delete the Contact client */
  .delete(contactCtrl.remove);

/** Load Contact client when API with contactId route parameter is hit */
router.param('contactId', contactCtrl.load);

module.exports = router;
