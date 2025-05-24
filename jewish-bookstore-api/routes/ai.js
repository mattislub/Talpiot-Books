const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/ai/complete-book', async (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ error: 'חסר שם ספר' });

  try {
    const prompt = `תן תיאור תורני על הספר "${title}" על הספר סגנון תורני לא יותר מ 20 מילים:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100
    });

    const description = response.choices[0].message.content.trim();
    res.json({ description });
  } catch (err) {
    console.error("❌ שגיאה ב-AI:", err.message);
    res.status(500).json({ error: 'שגיאה מה-AI' });
  }
});

module.exports = router;
