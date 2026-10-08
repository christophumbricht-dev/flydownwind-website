// local preview like GitHub Pages: node tools/serve.cjs [port] – folders serve index.html, unknown paths 404.html
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), port = +process.argv[2] || 5180;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml" };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let f = path.join(root, p);
  if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) {
    if (!p.endsWith("/")) { res.writeHead(301, { Location: p + "/" }); return res.end(); }
    f = path.join(f, "index.html");
  }
  if (!fs.existsSync(f)) { res.writeHead(404, { "Content-Type": TYPES[".html"] }); return res.end(fs.readFileSync(path.join(root, "404.html"))); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" });
  res.end(fs.readFileSync(f));
}).listen(port, () => console.log(`http://localhost:${port}/`));
