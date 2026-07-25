const crypto = require('crypto');
const { createClient } = require('@vercel/kv');

const kv = createClient();
const AUTH_KEY = 'flff-admin-auth';
const AVAILABILITY_KEY = 'flff-availability';

const DEFAULTS = {
  'Exclusive White Rice': true,
  'Swallow': true,
  'Exclusive Jollof Rice': true,
  'Exclusive Fried Rice': true,
  'Stir Fry Spag': true,
  'Special Noodles': true,
  'Boiled Yam': true,
  'Hot Moi Moi': true,
  'Beans': true,
  'Coleslaw': true,
  'Ewedu': true,
  'Gbegiri': true,
  'Abula': true,
  'Egusi': true,
  'Efo Riro': true,
  'Okra': true,
  'Stew': true,
  'Fried Egg': true,
  'Boiled Egg': true,
  'Beef': true,
  'Fish': true,
  'Chicken': true,
  'Bread': true,
  'Goat Meat': true,
  'Ponmo': true,
  'Plantain': true,
  'Assorted Meat': true,
  'Package 1: Ultimate Feast': true,
  'Package 2: Campus Special': true
};

const DEFAULT_ADMIN_USERNAME = 'LoavesandFish';
const DEFAULT_ADMIN_PASSWORD = 'Fedwithfiveandtwo5000';

function hashPassword(password, salt = null) {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 100000, 64, 'sha512').toString('hex');
  return `${actualSalt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computed, 'hex'));
}

async function getAuthState() {
  const stored = await kv.get(AUTH_KEY);
  if (stored && stored.username && stored.passwordHash) {
    return stored;
  }

  const newAuth = {
    username: DEFAULT_ADMIN_USERNAME,
    passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
    sessions: {}
  };
  await kv.set(AUTH_KEY, newAuth);
  return newAuth;
}

async function setAuthState(auth) {
  await kv.set(AUTH_KEY, auth);
}

async function getAvailability() {
  const stored = await kv.get(AVAILABILITY_KEY);
  return stored || DEFAULTS;
}

async function setAvailability(data) {
  await kv.set(AVAILABILITY_KEY, data);
}

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function createSession() {
  const auth = await getAuthState();
  const token = generateSessionToken();
  auth.sessions[token] = { authenticated: true, createdAt: Date.now() };
  await setAuthState(auth);
  return token;
}

async function verifyToken(token) {
  if (!token) return null;
  const auth = await getAuthState();
  return auth.sessions?.[token] || null;
}

async function invalidateAllSessions() {
  const auth = await getAuthState();
  auth.sessions = {};
  await setAuthState(auth);
}

function setCorsHeaders(res, methods = ['GET', 'POST', 'PUT', 'OPTIONS']) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function getCurrentAuthState() {
  return getAuthState();
}

async function changePassword(currentPassword, newPassword) {
  const auth = await getAuthState();
  if (!verifyPassword(currentPassword, auth.passwordHash)) return false;
  auth.passwordHash = hashPassword(newPassword);
  auth.sessions = {};
  await setAuthState(auth);
  return true;
}

module.exports = {
  getAvailability,
  setAvailability,
  verifyToken,
  createSession,
  setCorsHeaders,
  getCurrentAuthState,
  changePassword,
  verifyPassword,
  invalidateAllSessions,
};
