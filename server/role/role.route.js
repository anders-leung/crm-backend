const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const roleCtrl = require('./role.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /users - Get list of users */
  .get(validate(paramValidation.list), roleCtrl.list)

  /** POST /users - Create new user */
  .post(validate(paramValidation.createUser), roleCtrl.create);

router.route('/:userId')
  /** GET /users/:userId - Get user */
  .get(roleCtrl.get)

  /** PUT /users/:userId - Update user */
  .put(validate(paramValidation.updateUser), roleCtrl.update)

  /** DELETE /users/:userId - Delete user */
  .delete(roleCtrl.remove);

// TODO: Enable this maybe down the road when you think of how to do this better
// router.route('/:userId/jobs')
//   /** GET /users/:userId - Get all of the user's jobs */
//   .get(userCtrl.jobs);

/** Load user when API with userId route parameter is hit */
router.param('userId', roleCtrl.load);

module.exports = router;
