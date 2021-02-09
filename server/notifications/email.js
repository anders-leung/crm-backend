const pug = require('pug');
const nodemailer = require('nodemailer');
const { email } = require('../../config/config');

module.exports = (user, client, body, values, options, name) => new Promise((resolve) => {
  const transporter = nodemailer.createTransport({
    host: '74.208.5.2',
    port: 587,
    secure: false,
    auth: {
      user: user.email,
      pass: user.emailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const html = pug.compile(body.html)(values);
  // const text = pug.compile(body.text)(values);

  let mailOptions = {
    from: `${user.name}<${user.email}>`,
    to: client.email || client,
    html,
    // text,
  };

  if (process.env.NODE_ENV !== 'prod') {
    mailOptions.to = email.to;
    delete options.cc;  // eslint-disable-line no-param-reassign
  }

  mailOptions = Object.assign(mailOptions, options);

  transporter.sendMail(mailOptions)
    .then((info) => {
      const to = client.email || client;
      console.log(`${name} message to ${to} sent: ${info.messageId}`);
      resolve(true);
    })
    .catch((err) => {
      const code = err.code || err.status;
      const to = client.email || client.name || client;
      const error = err.message || err;
      console.log(`Email error ${code} to ${to}: ${error}`);
      resolve(false);
    });
});
