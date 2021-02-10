const exists = { $nin: [undefined, null] };
const notExists = { $in: [undefined, null] };
const existsString = { $nin: [undefined, null, ''] };
const notExistsString = { $in: [undefined, null, ''] };

module.exports = {
  exists,
  notExists,
  existsString,
  notExistsString,
};
