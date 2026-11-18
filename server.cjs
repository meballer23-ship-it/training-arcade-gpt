const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
const server = http.createServer((req,res) => {
  if (req.url !== '/' && req.url !== '/index.html') { res.writeHead(404); return res.end('Not found'); }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  fs.createReadStream(path.join(root, 'index.html')).pipe(res);
});
server.listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
