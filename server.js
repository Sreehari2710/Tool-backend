const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const saveToSheet = require('./backend/saveToSheet');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// API endpoint to provide keys to the frontend
app.get('/api/keys', (req, res) => {
  res.json({
    geminiApiKey: process.env.GEMINI_API_KEY,
    apifyToken: process.env.APIFY_TOKEN,
  });
});

// API endpoint for saving data to Google Sheet
app.post('/api/saveToSheet', async (req, res) => {
  try {
    const result = await saveToSheet(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in /api/saveToSheet:', error);
    res.status(500).json({ error: 'Failed to save to sheet' });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});