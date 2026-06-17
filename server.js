const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', hasKey: !!process.env.ANTHROPIC_API_KEY });
});

app.post('/ask', async (req, res) => {
  try {
    console.log("Received request:", req.body);
    console.log("API Key exists:", !!process.env.ANTHROPIC_API_KEY);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: req.body.message }]
      })
    });
    const data = await response.json();
    console.log("API response:", JSON.stringify(data));
    res.json({ reply: data.content[0].text });
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running!'));