const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const roleCtrl = require('./role.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /roles - Get list of roles */
  .get(validate(paramValidation.list), roleCtrl.list)

  /** POST /roles - Create new role */
  .post(validate(paramValidation.roles.create), roleCtrl.create);

router.route('/:roleId')
  /** GET /roles/:roleId - Get role */
  .get(roleCtrl.get)

  /** PUT /roles/:roleId - Update role */
  .put(validate(paramValidation.roles.update), roleCtrl.update)

  /** DELETE /roles/:roleId - Delete role */
  .delete(validate(paramValidation.roles.delete), roleCtrl.remove);

/** Load role when API with roleId route parameter is hit */
router.param('roleId', roleCtrl.load);

module.exports = router;
