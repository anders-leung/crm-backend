const pug = require('pug');
const Twilio = require('twilio');
const { twilio } = require('../../config/config');

let tclient;

module.exports = (number, body, values) => new Promise((resolve) => {
  if (!tclient) {
    tclient = new Twilio(twilio.accountSID, twilio.token);
  }

  const text = pug.compile(body.text)(values);
  const options = {
    body: text,
    from: twilio.number,
    to: `+1${number.replace(/[()\-\s]/g, '')}`,
  };

  if (process.env.NODE_ENV !== 'prod') {
    options.to = twilio.to;
  }

  tclient.messages.create(options)
    .then((message) => {
      console.log('Twilio message sent: ', message.sid);
      resolve(true);
    })
    .catch((err) => {
      console.log(`Twilio message to ${number} failed: `, err);
      resolve(false);
    });
});
