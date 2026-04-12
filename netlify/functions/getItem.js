const crypto = require('crypto');
const { getItem } = require('../../src/db');

function isValidApiKey(provided) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return false;
  if (!provided) return false;
  try {
    const a = Buffer.from(apiKey);
    const b = Buffer.from(provided);
    if (a.length !== b.length) {
      const ha = crypto.createHash('sha256').update(a).digest();
      const hb = crypto.createHash('sha256').update(b).digest();
      return crypto.timingSafeEqual(ha, hb);
    }
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };
    const auth = event.headers && (event.headers.authorization || event.headers.Authorization);
    const token = auth && auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
    if (!isValidApiKey(token)) return { statusCode: 401, body: 'Unauthorized' };

    const id = (event.queryStringParameters && event.queryStringParameters.id) ||
               (event.path && event.path.split('/').pop());
    if (!id) return { statusCode: 400, body: 'Missing id' };

    const item = getItem(id);
    if (!item) return { statusCode: 404, body: 'Not found' };
    return { statusCode: 200, body: JSON.stringify(item) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Server error' };
  }
};
