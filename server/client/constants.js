const { phoneTypes } = require('../helpers/constants');

const statuses = ['Active', 'Inactive', 'Struck Out', 'Taken Over', 'No YE', 'Dissolved', 'New'];
const types = ['T2', 'BK', 'NR', 'PR', 'T1134', 'T3', 'T4', 'T5'];
const industries = [
  'Investment Holdco', 'Holdco', 'Wholesale', 'Retail', 'Trading Internet Sale', 'Tutoring: Preschool, Child care,  Tutoring & Related Serv',
  'Transportation', 'Food Serv: Restaurant , Food Court  & Food Related Serv', 'Auto: Auto Body, Auto Repair, Auto Dealer and Related Serv',
  'Insurance: General and Life Agency', 'Manufacturing', 'Consulting', 'Media', 'Realtor, Property Mgmt & Related Serv', 'Advertising',
  'Farm', 'Export', 'Medical: Dr, Dentist, TCM & Medical Related', 'Printing', 'Construction', 'Seafood Harvesting',
  'Accommodations Agent', 'Rental Income', 'Investment Co, Rental Income', 'Limited Partnership', 'Management Services',
  'Food: Wholesale & Retail, Grocery', 'Travel: Travel Agency, Accommodation and Related Serv', 'Legal: Lawyer, Notary and Related Serv',
  'Service: Laundry, Cleaning, Home Renovation', 'Beauty Related: Nail, Beauty Centre, Cosmetic, Hair', 'Tech Co & Related Serv: Computer, Network',
];
const services = ['Open', 'JT', 'RRSP', 'SP RRSP', 'RRIF', 'SP RRIF', 'LIF', 'TFSA', 'RESP', 'RDSP'];
const terms = ['Term 10', 'Term 15', 'Term 20', 'Term 35', 'P WL', 'En WL', 'UL'];

module.exports = {
  statuses,
  types,
  phoneTypes,
  industries,
  services,
  terms,
};
