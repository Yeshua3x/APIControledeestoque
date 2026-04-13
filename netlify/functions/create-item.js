const { createItem } = require('../../src/data');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const item = createItem(body);
    return { statusCode: 201, body: JSON.stringify(item) };
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad request' }) };
  }
};
