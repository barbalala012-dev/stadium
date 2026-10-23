const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../app/src/main/assets');
http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname === '/preview') {
    res.setHeader('Content-Type','text/html; charset=utf-8');
    return res.end('<!doctype html><html lang="ko"><meta charset="utf-8"><title>스포디움 온 · Android 미리보기</title><style>body{margin:0;background:#e6eadf;display:grid;place-content:center;min-height:100vh;font:14px sans-serif;color:#245139}header{display:flex;justify-content:space-between;margin:16px 6px}iframe{width:390px;height:844px;max-height:88vh;border:8px solid #173d2e;border-radius:36px;background:#f5f6f1;box-shadow:0 20px 60px #173d2e26}a{color:inherit}@media(max-width:450px){iframe{width:calc(100vw - 16px);height:100dvh;max-height:100dvh;border:0;border-radius:0}header{display:none}}</style><header><b>spodium on · Android</b><a href="/">전체 화면 ↗</a></header><iframe title="스포디움 온 앱 미리보기" src="/"></iframe></html>');
  }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    res.setHeader('Content-Type', file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'application/javascript' : 'text/html; charset=utf-8');
    res.end(data);
  });
}).listen(4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173/preview'));
