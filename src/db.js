const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = process.env.SQLITE_DB_PATH || path.join(__dirname, '..', 'data.db');

if (!fs.existsSync(DB_PATH)) {
  const dbInit = new Database(DB_PATH);
  dbInit.exec(`
    CREATE TABLE items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT UNIQUE,
      name TEXT,
      quantity INTEGER,
      price REAL,
      location TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  dbInit.close();
}

const db = new Database(DB_PATH, { fileMustExist: false });

function createItem({ sku, name, quantity = 0, price = 0.0, location = '' }) {
  const stmt = db.prepare(`INSERT INTO items (sku, name, quantity, price, location) VALUES (?, ?, ?, ?, ?)`);
  const info = stmt.run(sku, name, quantity, price, location);
  return db.prepare('SELECT * FROM items WHERE id = ?').get(info.lastInsertRowid);
}

function listItems() {
  return db.prepare('SELECT * FROM items ORDER BY id DESC').all();
}

function getItem(id) {
  return db.prepare('SELECT * FROM items WHERE id = ?').get(id);
}

function updateItem(id, fields) {
  const current = getItem(id);
  if (!current) return null;
  const updated = {
    sku: fields.sku ?? current.sku,
    name: fields.name ?? current.name,
    quantity: fields.quantity ?? current.quantity,
    price: fields.price ?? current.price,
    location: fields.location ?? current.location
  };
  db.prepare(`UPDATE items SET sku=?, name=?, quantity=?, price=?, location=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .run(updated.sku, updated.name, updated.quantity, updated.price, updated.location, id);
  return getItem(id);
}

function deleteItem(id) {
  const stmt = db.prepare('DELETE FROM items WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

module.exports = { createItem, listItems, getItem, updateItem, deleteItem };
