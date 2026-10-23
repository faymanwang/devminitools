import http from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
const root = process.cwd();
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.json': 'application/json' };
const port = Number(process.env.PORT || 4173);
http.createServer((req, res) => {
    try {
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        if (/(?:^|\/)\.|^\/(?:node_modules|release|dist|content|tests|scripts|electron)(?:\/|$)/.test(pathname)) throw new Error('Not public');
        let file = resolve(root, '.' + pathname);
        if (file !== root && !file.startsWith(root + sep)) throw new Error('Outside preview');
        try { if (statSync(file).isDirectory()) file = resolve(file, 'index.html'); }
        catch { if (!extname(file)) file += '.html'; else throw new Error('Missing'); }
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Type', types[extname(file)] || 'text/plain');
        res.end(readFileSync(file));
    } catch { res.statusCode = 404; res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Current source preview: http://127.0.0.1:${port}`));
