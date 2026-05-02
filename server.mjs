import {createServer} from 'node:http';
import {
	readFileSync,
	writeFileSync,
	existsSync,
	createReadStream,
	statSync
} from 'node:fs';
import {join, extname} from 'node:path';
import {networkInterfaces} from 'node:os';
import {fileURLToPath} from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(ROOT, '.build');
const DATA = join(ROOT, 'data.json');
const PORT = Number(process.env.PORT) || 3001;

const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.ico': 'image/x-icon',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.woff2': 'font/woff2',
};

if (!existsSync(DIST)) {
	console.error('❌  dist/ not found — run "npm run build" first.\n');
	process.exit(1);
}

function serveStatic(res, filePath) {
	try {
		if (statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
		res.writeHead(200, {'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream'});
		createReadStream(filePath).pipe(res);
	} catch {
		// SPA fallback — let the client router handle the path
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		createReadStream(join(DIST, 'index.html')).pipe(res);
	}
}

createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'OPTIONS') {
		res.writeHead(204);
		return res.end();
	}

	if (req.url === '/api/data') {
		if (req.method === 'GET') {
			const body = existsSync(DATA) ? readFileSync(DATA, 'utf-8') : '{}';
			res.writeHead(200, {'Content-Type': 'application/json'});
			return res.end(body);
		}

		if (req.method === 'POST') {
			let body = '';
			req.on('data', chunk => (body += chunk));
			req.on('end', () => {
				try {
					JSON.parse(body); // validate before writing
					writeFileSync(DATA, body);
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end('{"ok":true}');
				} catch {
					res.writeHead(400);
					res.end('Invalid JSON');
				}
			});
			return;
		}
	}

	const filePath = join(DIST, new URL(req.url, 'http://x').pathname);
	serveStatic(res, filePath);
}).listen(PORT, '0.0.0.0', () => {
	const networkIPs = Object.values(networkInterfaces())
		.flat()
		.filter(n => n?.family === 'IPv4' && !n.internal)
		.map(n => `  Network (phone/tablet): http://${n.address}:${PORT}`);

	console.log(`\nFitTrack running`);
	console.log(`  Local:   http://localhost:${PORT}`);
	networkIPs.forEach(l => console.log(l));
	console.log(`\n  Data file: ${DATA}`);
	console.log('  Press Ctrl+C to stop.\n');
});
