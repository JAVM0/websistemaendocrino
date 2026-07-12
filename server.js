const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(ROOT, 'index.html'), (e, c) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(c, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Error del servidor');
            }
        } else {
            // Soporte para range requests (video streaming)
            if (req.headers.range) {
                const stat = fs.statSync(filePath);
                const range = req.headers.range;
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
                const chunkSize = end - start + 1;

                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': contentType,
                });

                const stream = fs.createReadStream(filePath, { start, end });
                stream.pipe(res);
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor local activo en http://localhost:${PORT}`);
});