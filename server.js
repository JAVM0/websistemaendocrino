const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

function serveStatic(folder) {
  return (req, res) => {
    const filePath = path.join(__dirname, folder, req.params[0]);
    res.sendFile(filePath, (err) => {
      if (err) res.status(404).end();
    });
  };
}

app.get('/css/*', serveStatic('css'));
app.get('/js/*', serveStatic('js'));
app.get('/assets/*', serveStatic('assets'));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor http://localhost:${PORT}`);
});

module.exports = app;
