// const express = require('express');
import express from "express";
import ViteExpress from "vite-express";
import mysql from "mysql";
const PORT = 3000;

const app = express();
// Midleware
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce-database",
});
// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Get all items
app.get('/api/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Create a new item
app.post('/api/items', (req, res) => {
  const newItem = req.body;
  db.query('INSERT INTO items SET ?', newItem, (err, result) => {
    if (err) throw err;
    newItem.id = result.insertId;
    res.status(201).json(newItem);
  });
});

// Update an existing item by ID
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.query("UPDATE items SET name = ? WHERE id = ?", [name, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ updated: this.changes });
  });
});

// Delete an item by ID
app.delete('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  db.query('DELETE FROM items WHERE id = ?', [itemId], (err) => {
    if (err) throw err;
    res.json({ message: 'Item deleted successfully' });
  });
});

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on port http://localhost:${PORT}/`),
);