const express = require('express');
const say = require('say');
const app = express();
const port = 3500;
const cors = require('cors');

app.use(express.json());
app.use(cors())
app.post('/speak', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }

  // Use the 'say' library to speak the text
  say.speak(text);

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
