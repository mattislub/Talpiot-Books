const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST new order
router.post('/', async (req, res) => {
  const { user_id, items, total } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id',
      [user_id, total]
    );

    const orderId = rows[0].id;

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.book_id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ order_id: orderId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
