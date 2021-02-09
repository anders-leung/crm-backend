const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const jobCtrl = require('./job.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /jobs - Get list of job */
  .get(validate(paramValidation.list), jobCtrl.list)
  /** POST /jobs - Create a new job */
  .post(jobCtrl.save);

router.route('/:jobId')
  /** PUT /jobs/:jobId - Update job */
  .put(jobCtrl.update)
  /** DELETE /jobs/:jobId - Delete job */
  .delete(jobCtrl.remove);

/** Load user when API with jobId route parameter is hit */
router.param('jobId', jobCtrl.load);

module.exports = router;
