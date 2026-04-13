const { updateItem, getItem } = require('../../src/data');

exports.handler = async (event) => {
  const id = event.path.split('/').pop();
  if (!getItem(id)) return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
  try {
    const body = JSON.parse(event.body || '{}');
    const updated = updateItem(id, body);
    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad request' }) };
  }
};
