const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const invoiceCtrl = require('./invoice.controller');
// require('./notifications');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /invoices - Get list of invoices */
  .get(invoiceCtrl.list)

  /** POST /invoices - Create new invoice */
  .post(invoiceCtrl.save);

router.route('/analysis')
  /** GET /invoices/analysis - Get breakdown of totals for services for each user */
  .get(invoiceCtrl.analysis);

router.route('/charts')
  /** GET /invoices/charts - Get breakdown of totals for services for each user */
  .get(invoiceCtrl.charts);

router.route('/options')
  /** GET /invoices/options - Get invoice */
  .get(invoiceCtrl.options);

router.route('/newInvoice')
  /** GET /invoices/newClient */
  .get(invoiceCtrl.newInvoice);

router.route('/:invoiceId')
  /** GET /invoices/:invoiceId - Get invoice */
  .get(invoiceCtrl.get)
  /** PUT /invoices/:invoiceId - Update invoice */
  .put(invoiceCtrl.update)
  /** DELETE /invoices/:invoiceId - Delete invoice */
  .delete(invoiceCtrl.remove);

/** Load invoice when API with invoiceId route parameter is hit */
router.param('invoiceId', invoiceCtrl.load);

module.exports = router;
