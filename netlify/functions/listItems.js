const { listItems } = require('../../src/db');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };

    // Optional API key check
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      const auth = event.headers && (event.headers.authorization || event.headers.Authorization);
      if (!auth || !auth.startsWith('Bearer ') || auth.split(' ')[1] !== apiKey) {
        return { statusCode: 401, body: 'Unauthorized' };
      }
    }

    const items = listItems();
    return { statusCode: 200, body: JSON.stringify(items) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Server error' };
  }
};
