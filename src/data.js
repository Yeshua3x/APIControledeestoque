const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'data.json');

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function writeDB(items) {
  fs.writeFileSync(DB_PATH, JSON.stringify(items, null, 2), 'utf8');
}

function createItem({ sku, name, quantity = 0, price = 0.0, location = '' }) {
  const items = readDB();
  const id = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const item = { id, sku, name, quantity, price, location, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  items.push(item);
  writeDB(items);
  return item;
}

function listItems() {
  return readDB().sort((a,b) => b.id - a.id);
}

function getItem(id) {
  const items = readDB();
  return items.find(i => i.id === Number(id)) || null;
}

function updateItem(id, fields) {
  const items = readDB();
  const idx = items.findIndex(i => i.id === Number(id));
  if (idx === -1) return null;
  const current = items[idx];
  const updated = {
    ...current,
    sku: fields.sku ?? current.sku,
    name: fields.name ?? current.name,
    quantity: fields.quantity ?? current.quantity,
    price: fields.price ?? current.price,
    location: fields.location ?? current.location,
    updated_at: new Date().toISOString()
  };
  items[idx] = updated;
  writeDB(items);
  return updated;
}

function deleteItem(id) {
  let items = readDB();
  const before = items.length;
  items = items.filter(i => i.id !== Number(id));
  writeDB(items);
  return items.length < before;
}

module.exports = { createItem, listItems, getItem, updateItem, deleteItem };
