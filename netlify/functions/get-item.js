const { getItem } = require('../../src/data');

exports.handler = async (event) => {
  const id = event.path.split('/').pop();
  const item = getItem(id);
  if (!item) return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
  return { statusCode: 200, body: JSON.stringify(item) };
};
