const setupQuery = (req) => {
  let { query: { query, select } } = req;
  query = JSON.parse(query);
  if (!select) select = '';
  const selectTokens = select.split(' ');
  const outer = [];
  const client = [];
  const nestedClient = [];
  selectTokens.forEach((field) => {
    if (field.includes('serviceClient.client.client.')) {
      nestedClient.push(field.replace('serviceClient.client.client.', ''));
    } else if (field.includes('serviceClient.client.')) {
      client.push(field.replace('serviceClient.client.', ''));
    } else {
      outer.push(field);
    }
  });
  return { query, select: outer, nestedSelect: client, nestedClientSelect: nestedClient };
};

module.exports = setupQuery;
