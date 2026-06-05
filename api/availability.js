const fs = require('fs');

const DATA_FILE = '/tmp/flff-availability.json';

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

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { ...DEFAULTS };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json(readData());
  }

  if (req.method === 'PUT') {
    try {
      writeData(req.body);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).end();
};
