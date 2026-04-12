const { deleteItem } = require('../../src/db');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'DELETE') return { statusCode: 405, body: 'Method Not Allowed' };

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

    const ok = deleteItem(id);
    if (!ok) return { statusCode: 404, body: 'Not found' };
    return { statusCode: 204, body: '' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Server error' };
  }
};
