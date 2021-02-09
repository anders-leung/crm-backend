const { get } = require('lodash');
const chai = require('chai');

const expect = chai.expect;

/**
 * Helper function to run all the expect lines
 * @param {Document} response - The resulting response of the save/update
 * @param {object} original - The original data passed to a POST or PUT
 */
const verify = (response, original, paths) => {
  paths.forEach((path) => {
    let equal = 'equal';
    let actual = get(response, path);
    let expected = get(original, path);
    if (Array.isArray(path)) {
      equal = 'eql';
      actual = get(response, path[0]);
      expected = get(original, path[0]);
      if (path[1] === 'date') {
        actual = new Date(actual);
        if (typeof expected === 'string') {
          expected = new Date(expected);
        }
      }
    }

    expect(actual).to[equal](expected, `Expected ${path} to equal ${expected}, but was ${actual}`);
  });
};

module.exports = verify;
