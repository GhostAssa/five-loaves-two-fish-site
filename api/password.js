const { changePassword, setCorsHeaders, verifyToken } = require('./_state');

module.exports = async function handler(req, res) {
  setCorsHeaders(res, ['POST', 'OPTIONS']);

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') || '';
    const session = await verifyToken(token);
    if (!session || !session.authenticated) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required.' });
    }

    if (await changePassword(currentPassword, newPassword)) {
      return res.status(200).json({ ok: true });
    }

    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  return res.status(405).end();
};
