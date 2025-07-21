const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000; // The port our backend will run on

// Enable CORS for our frontend (running on port 8080 by default)
app.use(cors({
  origin: 'http://localhost:8080'
}));

// This is our "secure" download router
app.get('/api/download/:fileName', (req, res) => {
  // --- SECURITY CHECK ---
  // In a real app, you'd check a database to see if the user is logged in
  // and has permission. Here, we'll simulate it with a simple header check.
  const authHeader = req.headers['authorization'];
    console.log(req.headers)
  if (authHeader !== 'Bearer my-secret-token') {
    return res.status(403).send('Forbidden: You do not have permission.');
  }

  const { fileName } = req.params;
  const filePath = path.join(__dirname, 'files', fileName); // Path to the file

  // The 'download' method sets the correct headers to trigger a browser download
  res.download(filePath, (err) => {
    if (err) {
      // If the file doesn't exist or there's another error
      console.error("File download error:", err);
      res.status(404).send('File not found.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});