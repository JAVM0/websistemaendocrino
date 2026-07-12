const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname), {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*/css', (_req, res) => {
  res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('*/js', (_req, res) => {
  res.sendFile(path.join(__dirname, 'main.js'));
});

app.listen(PORT, () => {
  console.log(`Servidor http://localhost:${PORT}`);
});

module.exports = app;
