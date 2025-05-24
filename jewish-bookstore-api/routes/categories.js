const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// POST /api/categories - יצירת קטגוריה חדשה
router.post('/', async (req, res) => {
  const { name, parent_id } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing category name' });
  }

  try {
    const query = `
      INSERT INTO categories (name, parent_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [name, parent_id || null];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

module.exports = router;
