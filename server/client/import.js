const { set } = require('lodash');
const mongoose = require('mongoose');
const XLSX = require('xlsx-populate');
const Client = require('./client.model');
mongoose.Promise = require('bluebird');

const columns = [
  'client.title',
  'client.name',
  'spouse.name',
  'type',
  '',
  '',
  '',
  '',
  '',
  'phones',
  'phones',
  'phones',
  'address',
  'email',
];

if (process.env.NODE_ENV === 'prod') {
  mongoose.connect('mongodb://localhost:27017/ia');

  const promises = [];
  const path = './server/client/Address Book.xlsx';
  XLSX.fromFileAsync(path)
    .then((workbook) => {
      const sheet = workbook.sheet(0);
      const nameColumn = 2;
      let client;
      let row = 2;
      let currentName = sheet.row(row).cell(nameColumn);

      while (currentName.value()) {
        client = new Client({ status: 'Active' });

        columns.forEach((field, i) => {
          const value = sheet.row(row).cell(i + 1).value();
          if (!field || !value) return;

          if (i === 1 || i === 2) {
            const [lastName, firstName] = value.split(', ');
            let person = 'client';
            if (i === 2) {
              person = 'spouse';
            }
            client[person].lastName = lastName;
            client[person].firstName = firstName;
            if (!firstName) {
              client[person].firstName = lastName;
              client[person].lastName = undefined;
            }
          }

          if (field.includes('phones')) {
            const match = value.match(/(([0-9]+-){1,2}[0-9]+)|(\([0-9]+\)\s([0-9]+-)[0-9]+)/);
            if (!match) return;

            const number = match[0];
            const tokens = value.split(number);
            const phone = {
              note: tokens[1].trim(),
              number,
            };

            client.phones.push(phone);
            return;
          }

          set(client, field, value);
        });

        promises.push(client.save());

        row += 1;
        currentName = sheet.row(row).cell(nameColumn);
      }

      return Promise.all(promises);
    })
    .then((results) => {
      console.log(`Done importing ${results.length} clients from excel file`);
    })
    .catch((err) => {
      console.log('Error importing clients from excel file', err);
    });
}
