const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const optionCtrl = require('./option.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /options - Get list of options */
  .get(validate(paramValidation.list), optionCtrl.list)

  /** POST /options - Create new option */
  .post(validate(paramValidation.options.create), optionCtrl.create);

router.route('/options')
  /** GET /options - Get option variables for the frontend */
  .get(optionCtrl.options);

router.route('/:optionId')
  /** GET /options/:optionId - Get option */
  .get(optionCtrl.get)

  /** PUT /options/:optionId - Update option */
  .put(validate(paramValidation.update('option')), optionCtrl.update)

  /** DELETE /options/:optionId - Delete option */
  .delete(validate(paramValidation.delete('option')), optionCtrl.remove);

/** Load option when API with optionId route parameter is hit */
router.param('optionId', optionCtrl.load);

module.exports = router;
