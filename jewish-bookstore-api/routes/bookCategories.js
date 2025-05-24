const express = require('express');
const router = express.Router();
const pool = require('../db');

// שיוך ספר לקטגוריות
router.post('/', async (req, res) => {
  const { book_id, categories } = req.body;

  if (!book_id || !Array.isArray(categories)) {
    return res.status(400).json({ error: 'Missing book_id or categories[]' });
  }

  try {
    const insertQuery = `
      INSERT INTO book_categories (book_id, category_id)
      VALUES ${categories.map((_, i) => `($1, $${i + 2})`).join(', ')}
      ON CONFLICT DO NOTHING
    `;
    const values = [book_id, ...categories];
    await pool.query(insertQuery, values);

    res.status(200).json({ message: 'Categories linked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to link categories' });
  }
});

module.exports = router;
