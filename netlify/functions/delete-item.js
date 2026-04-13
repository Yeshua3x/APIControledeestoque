const { deleteItem } = require('../../src/data');

exports.handler = async (event) => {
  const id = event.path.split('/').pop();
  const ok = deleteItem(id);
  return { statusCode: ok ? 204 : 404, body: ok ? '' : JSON.stringify({ error: 'Not found' }) };
};
