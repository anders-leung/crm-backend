const { email } = require('../../../config/config');

module.exports = {
  email: email.user,
  password: 'test',
  role: 'Employee',
  initials: 'AND',
  emailPassword: email.password,
  name: 'Anders',
};
