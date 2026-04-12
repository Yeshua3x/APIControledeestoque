const { updateItem } = require('../../src/db');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'PUT' && event.httpMethod !== 'PATCH') return { statusCode: 405, body: 'Method Not Allowed' };

    // Optional API key check
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      const auth = event.headers && (event.headers.authorization || event.headers.Authorization);
      if (!auth || !auth.startsWith('Bearer ') || auth.split(' ')[1] !== apiKey) {
        return { statusCode: 401, body: 'Unauthorized' };
      }
    }

    const id = (event.queryStringParameters && event.queryStringParameters.id) ||
               (event.path && event.path.split('/').pop());
    if (!id) return { statusCode: 400, body: 'Missing id' };

    const fields = JSON.parse(event.body || '{}');
    const updated = updateItem(id, fields);
    if (!updated) return { statusCode: 404, body: 'Not found' };
    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Server error' };
  }
};
