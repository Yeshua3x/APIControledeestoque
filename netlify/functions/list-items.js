const { listItems } = require('../../src/data');

exports.handler = async () => {
  try {
    return { statusCode: 200, body: JSON.stringify(listItems()) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal' }) };
  }
};
