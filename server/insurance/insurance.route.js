const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const insuranceCtrl = require('./insurance.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(insuranceCtrl.list);

router.route('/:insuranceId')
  /** GET /insurances/:insuranceId - Get insurance */
  .get(insuranceCtrl.get)
  /** PUT /insurances/:insuranceId - Update insurance */
  .put(validate(paramValidation.saveObject), insuranceCtrl.update)
  /** DELETE /insurances/:insuranceId - Delete insurance */
  .delete(insuranceCtrl.remove);

/** Load insurance when API with insuranceId route parameter is hit */
router.param('insuranceId', insuranceCtrl.load);

module.exports = router;
