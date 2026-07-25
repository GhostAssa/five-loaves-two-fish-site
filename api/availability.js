const { getAvailability, setAvailability, verifyToken, setCorsHeaders } = require('./_state');

module.exports = async function handler(req, res) {
  setCorsHeaders(res, ['GET', 'PUT', 'OPTIONS']);

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const data = await getAvailability();
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') || req.headers.cookie;
    const session = await verifyToken(token);
    if (!session || !session.authenticated) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid availability payload.' });
    }

    try {
      await setAvailability(req.body);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).end();
};
