const express = require('express');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
const clientRoutes = require('./server/client/client.route');
const optionRoutes = require('./server/option/option.route');
const jobRoutes = require('./server/job/job.route');
const roleRoutes = require('./server/role/role.route');
const invoiceRoutes = require('./server/invoice/invoice.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount client routes at /clients
router.use('/clients', clientRoutes);

// mount option routes at /options
router.use('/options', optionRoutes);

// mount job routes at /job
router.use('/jobs', jobRoutes);

// mount job routes at /job
router.use('/roles', roleRoutes);

// mount job routes at /invoices
router.use('/invoices', invoiceRoutes);

module.exports = router;
