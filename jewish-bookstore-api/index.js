require('dotenv').config();
console.log('📦 Environment variables loaded:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('PORT:', process.env.PORT);

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');
const pool = require('./db');

const app = express();
const bookCategoriesRoutes = require('./routes/bookCategories');
app.use('/api/book-categories', bookCategoriesRoutes);
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, uuid() + path.extname(file.originalname))
});
const upload = multer({ storage });

// קטגוריות
const categoryRoutes = require('./routes/categories');
app.use(express.urlencoded({ extended: true }));
app.use('/api/categories', categoryRoutes);

// ספרים: שליפה עם מחירים והנחות
app.get('/api/books', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.description,
        b.price AS regular_price,
        b.image_url,
        COALESCE(d.discount_price, NULL) AS discount_price,
        CASE 
          WHEN d.discount_price IS NOT NULL THEN d.discount_price
          ELSE b.price
        END AS final_price
      FROM books b
      LEFT JOIN discounts d 
        ON d.book_id = b.id
        AND d.active = TRUE
        AND (d.start_date IS NULL OR d.start_date <= NOW())
        AND (d.end_date IS NULL OR d.end_date >= NOW())
      ORDER BY b.created_at DESC;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// הוספת ספר חדש
// הוספת ספר חדש (כולל שדה status)
app.post('/api/books', upload.single('image'), async (req, res) => {
  const { title, author, description, price, status } = req.body;
  const imageUrl = req.file ? '/uploads/' + req.file.filename : null;

  try {
    const query = `
      INSERT INTO books (title, author, description, price, image_url, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      title,
      author,
      description,
      parseFloat(price),
      imageUrl,
      status || 'available' // ברירת מחדל אם חסר
    ];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]); // מחזיר את ה-book כולל id
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// מחיקת ספר
app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const aiRoutes = require('./routes/ai');
app.use('/api', aiRoutes);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log('✅ API רץ על פורט', PORT);
});
