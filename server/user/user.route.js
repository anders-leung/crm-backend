const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const userCtrl = require('./user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /users - Get list of users */
  .get(validate(paramValidation.list), userCtrl.list)

  /** POST /users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/options')
  .get(userCtrl.options);

router.route('/:userId')
  /** GET /users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /users/:userId - Update user */
  .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /users/:userId - Delete user */
  .delete(userCtrl.remove);

// TODO: Enable this maybe down the road when you think of how to do this better
// router.route('/:userId/jobs')
//   /** GET /users/:userId - Get all of the user's jobs */
//   .get(userCtrl.jobs);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;
