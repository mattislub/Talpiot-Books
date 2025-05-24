const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all books (with optional discounts)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.description,
        b.price AS regular_price,
        b.image_url,
        b.stock,
        COALESCE(d.discount_price, NULL) AS discount_price,
        CASE 
          WHEN d.discount_price IS NOT NULL THEN d.discount_price
          ELSE b.price
        END AS final_price
      FROM books b
      LEFT JOIN discounts d 
        ON d.book_id = b.id
        AND d.active IS TRUE
        AND (d.start_date IS NULL OR d.start_date <= NOW())
        AND (d.end_date IS NULL OR d.end_date >= NOW())
      ORDER BY b.created_at DESC;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;