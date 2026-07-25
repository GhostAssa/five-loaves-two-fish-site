const { getCurrentAuthState, verifyPassword, createSession, setCorsHeaders, verifyToken } = require('./_state');

module.exports = async function handler(req, res) {
  setCorsHeaders(res, ['GET', 'POST', 'OPTIONS']);

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') || '';
    const session = await verifyToken(token);
    if (!session || !session.authenticated) {
      return res.status(401).json({ authenticated: false });
    }
    const auth = await getCurrentAuthState();
    return res.status(200).json({ authenticated: true, username: auth.username });
  }

  if (req.method === 'POST') {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required.' });
    }

    const auth = await getCurrentAuthState();
    if (username !== auth.username || !verifyPassword(password, auth.passwordHash)) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = await createSession();
    return res.status(200).json({ token });
  }

  return res.status(405).end();
};
