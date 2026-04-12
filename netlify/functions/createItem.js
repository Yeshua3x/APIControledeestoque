const { createItem } = require('../../src/db');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const body = JSON.parse(event.body || '{}');
    if (!body.sku || !body.name) return { statusCode: 400, body: 'Missing sku or name' };

    // Optional simple API key check (if set in env)
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      const auth = event.headers && (event.headers.authorization || event.headers.Authorization);
      if (!auth || !auth.startsWith('Bearer ') || auth.split(' ')[1] !== apiKey) {
        return { statusCode: 401, body: 'Unauthorized' };
      }
    }

    const item = createItem(body);
    return { statusCode: 201, body: JSON.stringify(item) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Server error' };
  }
};
