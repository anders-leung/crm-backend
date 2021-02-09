module.exports = {
  name: 'Unit Testing Client',
  address: {
    street: '123 Street',
    city: 'City',
    province: 'Province',
    postalCode: 'Postal Code',
    country: 'Country',
  },
  remarks: 'Client created just for unit testing',
  contacts: [
    {
      firstName: 'Contact',
      lastName: 'One',
      emails: [
        {
          emailType: ['Do Not Send'],
          address: 'contact_one.do_not_send@unit-testing-client.com',
        },
        {
          emailType: ['Accounts', 'For Sign'],
          address: 'contact_one.other@unit-testing-client.com',
        },
        {
          emailType: ['Default'],
          address: 'contact_one.default@unit-testing-client.com',
        },
      ],
      phones: [
        {
          phoneType: 'Work',
          number: '(123) 456-7890',
          extension: '123',
        },
        {
          phoneType: 'Home',
          number: '(456) 789-0123',
          extension: '456',
        },
        {
          phoneType: 'Cell',
          number: '(789) 012-3456',
          extension: '789',
        },
      ],
    },
  ],
};
