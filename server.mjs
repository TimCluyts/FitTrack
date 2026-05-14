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
import {randomUUID} from 'node:crypto';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(ROOT, '.build');
const DATA = join(process.env.DATA_DIR ?? ROOT, 'data.json');
const PORT = Number(process.env.PORT) || 3001;
const AUTH_USER = process.env.AUTH_USER ?? '';
const AUTH_PASS = process.env.AUTH_PASS ?? '';
const AUTH_ENABLED = AUTH_USER.length > 0 && AUTH_PASS.length > 0;

function isAuthorized(req) {
	if (!AUTH_ENABLED) return true;
	const header = req.headers['authorization'] ?? '';
	if (!header.startsWith('Basic ')) return false;
	const decoded = Buffer.from(header.slice(6), 'base64').toString('utf-8');
	const colon = decoded.indexOf(':');
	if (colon === -1) return false;
	return decoded.slice(0, colon) === AUTH_USER && decoded.slice(colon + 1) === AUTH_PASS;
}

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

const DIST_EXISTS = existsSync(DIST);
if (!DIST_EXISTS) {
	console.warn('⚠  .build/ not found — running in API-only mode. Use "npm run dev" for the frontend.\n');
}

function capitalize(str) {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function initData() {
	const timId = randomUUID();
	const davineId = randomUUID();
	return {
		users: [
			{id: timId, name: 'Tim'},
			{id: davineId, name: 'Davine'}
		],
		products: [],
		recipes: [],
		stores: [],
		prices: [],
		userData: {
			[timId]: {logEntries: [], weightEntries: [], exercises: [], routines: [], workoutLogs: [], runLogs: [], goals: {}, favorites: []},
			[davineId]: {logEntries: [], weightEntries: [], exercises: [], routines: [], workoutLogs: [], runLogs: [], goals: {}, favorites: []}
		}
	};
}

function migrate(d) {
	// Detect old format: has shared object or users is an object (not array)
	const isOldFormat = d.shared !== undefined || (d.users && !Array.isArray(d.users));
	if (!isOldFormat) return d;

	console.log('Migrating data from old format...');

	const newData = {
		users: [],
		products: d.shared?.products ?? d.products ?? [],
		recipes: d.shared?.recipes ?? d.recipes ?? [],
		userData: {}
	};

	// Convert old users object to array
	const oldUsers = d.users ?? {};
	for (const [key, oldUserData] of Object.entries(oldUsers)) {
		const id = randomUUID();
		newData.users.push({id, name: capitalize(key)});
		const ud = (oldUserData && typeof oldUserData === 'object') ? oldUserData : {};
		newData.userData[id] = {
			logEntries: ud.logEntries ?? [],
			weightEntries: ud.weightEntries ?? [],
			exercises: ud.exercises ?? [],
			routines: ud.routines ?? [],
			workoutLogs: ud.workoutLogs ?? [],
			runLogs: ud.runLogs ?? [],
			goals: ud.goals ?? {},
			favorites: ud.favorites ?? []
		};
	}

	// If no users were found in the old format, init with defaults
	if (newData.users.length === 0) {
		const timId = randomUUID();
		const davineId = randomUUID();
		newData.users = [
			{id: timId, name: 'Tim'},
			{id: davineId, name: 'Davine'}
		];
		newData.userData[timId] = {logEntries: [], weightEntries: [], exercises: [], routines: [], workoutLogs: [], runLogs: [], goals: {}, favorites: []};
		newData.userData[davineId] = {logEntries: [], weightEntries: [], exercises: [], routines: [], workoutLogs: [], runLogs: [], goals: {}, favorites: []};
	}

	return newData;
}

function readData() {
	if (!existsSync(DATA)) {
		const d = initData();
		writeFileSync(DATA, JSON.stringify(d, null, 2));
		return d;
	}
	try {
		const raw = readFileSync(DATA, 'utf-8');
		const parsed = JSON.parse(raw);
		let migrated = migrate(parsed);
		let dirty = migrated !== parsed;
		if (!migrated.stores) { migrated.stores = []; dirty = true; }
		if (!migrated.prices) { migrated.prices = []; dirty = true; }
		if (dirty) {
			writeFileSync(DATA, JSON.stringify(migrated, null, 2));
		}
		return migrated;
	} catch {
		const d = initData();
		writeFileSync(DATA, JSON.stringify(d, null, 2));
		return d;
	}
}

function writeData(d) {
	writeFileSync(DATA, JSON.stringify(d, null, 2));
}

function ensureUserData(data, userId) {
	if (!data.userData[userId]) {
		data.userData[userId] = {
			logEntries: [],
			weightEntries: [],
			exercises: [],
			routines: [],
			workoutLogs: [],
			runLogs: []
		};
	}
	if (!data.userData[userId].runLogs) data.userData[userId].runLogs = [];
	if (!data.userData[userId].goals) data.userData[userId].goals = {};
	if (!data.userData[userId].favorites) data.userData[userId].favorites = [];
}

function matchPath(pattern, url) {
	const urlPath = new URL(url, 'http://x').pathname;
	const patternParts = pattern.split('/');
	const urlParts = urlPath.split('/');
	if (patternParts.length !== urlParts.length) return null;
	const params = {};
	for (let i = 0; i < patternParts.length; i++) {
		if (patternParts[i].startsWith(':')) {
			params[patternParts[i].slice(1)] = urlParts[i];
		} else if (patternParts[i] !== urlParts[i]) {
			return null;
		}
	}
	return params;
}

function readBody(req) {
	return new Promise((resolve, reject) => {
		let body = '';
		req.on('data', chunk => (body += chunk));
		req.on('end', () => {
			try {
				resolve(JSON.parse(body));
			} catch {
				reject(new Error('Invalid JSON'));
			}
		});
		req.on('error', reject);
	});
}

function json(res, status, data) {
	res.writeHead(status, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(data));
}

function notFound(res) {
	json(res, 404, {error: 'Not found'});
}

function badRequest(res, msg) {
	json(res, 400, {error: msg ?? 'Bad request'});
}

function serveStatic(res, filePath) {
	try {
		if (statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
		res.writeHead(200, {'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream'});
		createReadStream(filePath).pipe(res);
	} catch {
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		createReadStream(join(DIST, 'index.html')).pipe(res);
	}
}

async function handleApi(req, res) {
	const method = req.method;
	const url = req.url;

	// GET /api/users
	if (method === 'GET' && matchPath('/api/users', url)) {
		const data = readData();
		return json(res, 200, data.users);
	}

	// GET /api/products
	if (method === 'GET' && matchPath('/api/products', url)) {
		const data = readData();
		return json(res, 200, data.products);
	}

	// POST /api/products
	if (method === 'POST' && matchPath('/api/products', url)) {
		const body = await readBody(req);
		const data = readData();
		const item = {id: randomUUID(), ...body};
		data.products.push(item);
		writeData(data);
		return json(res, 201, item);
	}

	// PUT /api/products/:id
	let params = matchPath('/api/products/:id', url);
	if (method === 'PUT' && params) {
		const body = await readBody(req);
		const data = readData();
		const idx = data.products.findIndex(p => p.id === params.id);
		if (idx === -1) return notFound(res);
		data.products[idx] = {...data.products[idx], ...body, id: params.id};
		writeData(data);
		return json(res, 200, data.products[idx]);
	}

	// DELETE /api/products/:id
	params = matchPath('/api/products/:id', url);
	if (method === 'DELETE' && params) {
		const data = readData();
		data.products = data.products.filter(p => p.id !== params.id);
		writeData(data);
		return json(res, 200, {ok: true});
	}

	// GET /api/recipes
	if (method === 'GET' && matchPath('/api/recipes', url)) {
		const data = readData();
		return json(res, 200, data.recipes);
	}

	// POST /api/recipes
	if (method === 'POST' && matchPath('/api/recipes', url)) {
		const body = await readBody(req);
		const data = readData();
		const item = {id: randomUUID(), ...body};
		data.recipes.push(item);
		writeData(data);
		return json(res, 201, item);
	}

	// PUT /api/recipes/:id
	params = matchPath('/api/recipes/:id', url);
	if (method === 'PUT' && params) {
		const body = await readBody(req);
		const data = readData();
		const idx = data.recipes.findIndex(r => r.id === params.id);
		if (idx === -1) return notFound(res);
		data.recipes[idx] = {...data.recipes[idx], ...body, id: params.id};
		writeData(data);
		return json(res, 200, data.recipes[idx]);
	}

	// DELETE /api/recipes/:id
	params = matchPath('/api/recipes/:id', url);
	if (method === 'DELETE' && params) {
		const data = readData();
		data.recipes = data.recipes.filter(r => r.id !== params.id);
		writeData(data);
		return json(res, 200, {ok: true});
	}

	// GET /api/users/:uid/log
	params = matchPath('/api/users/:uid/log', url);
	if (method === 'GET' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		return json(res, 200, data.userData[params.uid].logEntries);
	}

	// POST /api/users/:uid/log
	params = matchPath('/api/users/:uid/log', url);
	if (method === 'POST' && params) {
		const body = await readBody(req);
		const data = readData();
		ensureUserData(data, params.uid);
		const item = {id: randomUUID(), ...body};
		data.userData[params.uid].logEntries.push(item);
		writeData(data);
		return json(res, 201, item);
	}

	// PUT /api/users/:uid/log/:id
	params = matchPath('/api/users/:uid/log/:id', url);
	if (method === 'PUT' && params) {
		const body = await readBody(req);
		const data = readData();
		ensureUserData(data, params.uid);
		const idx = data.userData[params.uid].logEntries.findIndex(e => e.id === params.id);
		if (idx === -1) return json(res, 404, {error: 'Not found'});
		data.userData[params.uid].logEntries[idx] = {...data.userData[params.uid].logEntries[idx], ...body};
		writeData(data);
		return json(res, 200, data.userData[params.uid].logEntries[idx]);
	}

	// DELETE /api/users/:uid/log/:id
	params = matchPath('/api/users/:uid/log/:id', url);
	if (method === 'DELETE' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		data.userData[params.uid].logEntries = data.userData[params.uid].logEntries.filter(e => e.id !== params.id);
		writeData(data);
		return json(res, 200, {ok: true});
	}

	// GET /api/users/:uid/weight
	params = matchPath('/api/users/:uid/weight', url);
	if (method === 'GET' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		return json(res, 200, data.userData[params.uid].weightEntries);
	}

	// POST /api/users/:uid/weight
	params = matchPath('/api/users/:uid/weight', url);
	if (method === 'POST' && params) {
		const body = await readBody(req);
		const data = readData();
		ensureUserData(data, params.uid);
		const item = {id: randomUUID(), ...body};
		data.userData[params.uid].weightEntries.push(item);
		writeData(data);
		return json(res, 201, item);
	}

	// DELETE /api/users/:uid/weight/:id
	params = matchPath('/api/users/:uid/weight/:id', url);
	if (method === 'DELETE' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		data.userData[params.uid].weightEntries = data.userData[params.uid].weightEntries.filter(e => e.id !== params.id);
		writeData(data);
		return json(res, 200, {ok: true});
	}

	// GET /api/users/:uid/exercises
	params = matchPath('/api/users/:uid/exercises', url);
	if (method === 'GET' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		return json(res, 200, data.userData[params.uid].exercises);
	}

	// POST /api/users/:uid/exercises
	params = matchPath('/api/users/:uid/exercises', url);
	if (method === 'POST' && params) {
		const body = await readBody(req);
		const data = readData();
		ensureUserData(data, params.uid);
		const item = {id: randomUUID(), ...body};
		data.userData[params.uid].exercises.push(item);
		writeData(data);
		return json(res, 201, item);
	}

	// PUT /api/users/:uid/exercises/:id
	params = matchPath('/api/users/:uid/exercises/:id', url);
	if (method === 'PUT' && params) {
		const body = await readBody(req);
		const data = readData();
		ensureUserData(data, params.uid);
		const idx = data.userData[params.uid].exercises.findIndex(e => e.id === params.id);
		if (idx === -1) return notFound(res);
		data.userData[params.uid].exercises[idx] = {...data.userData[params.uid].exercises[idx], ...body, id: params.id};
		writeData(data);
		return json(res, 200, data.userData[params.uid].exercises[idx]);
	}

	// DELETE /api/users/:uid/exercises/:id
	params = matchPath('/api/users/:uid/exercises/:id', url);
	if (method === 'DELETE' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		data.userData[params.uid].exercises = data.userData[params.uid].exercises.filter(e => e.id !== params.id);
		writeData(data);
		return json(res, 200, {ok: true});
	}

	// GET /api/users/:uid/routines
	params = matchPath('/api/users/:uid/routines', url);
	if (method === 'GET' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		return json(res, 200, data.userData[params.uid].routines);
	}

	// POST /api/users/:uid/routines
	params = matchPath('/api/users/:uid/routines', url);
	if (method === 'POST' && params) {
		const body = await readBody(req);
		const data = readData();
		ensureUserData(data, params.uid);
		const item = {id: randomUUID(), ...body};
		data.userData[params.uid].routines.push(item);
		writeData(data);
		return json(res, 201, item);
	}

	// PUT /api/users/:uid/routines/:id
	params = matchPath('/api/users/:uid/routines/:id', url);
	if (method === 'PUT' && params) {
		const body = await readBody(req);
		const data = readData();
		ensureUserData(data, params.uid);
		const idx = data.userData[params.uid].routines.findIndex(r => r.id === params.id);
		if (idx === -1) return notFound(res);
		data.userData[params.uid].routines[idx] = {...data.userData[params.uid].routines[idx], ...body, id: params.id};
		writeData(data);
		return json(res, 200, data.userData[params.uid].routines[idx]);
	}

	// DELETE /api/users/:uid/routines/:id
	params = matchPath('/api/users/:uid/routines/:id', url);
	if (method === 'DELETE' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		data.userData[params.uid].routines = data.userData[params.uid].routines.filter(r => r.id !== params.id);
		writeData(data);
		return json(res, 200, {ok: true});
	}

	// GET /api/users/:uid/workout-logs
	params = matchPath('/api/users/:uid/workout-logs', url);
	if (method === 'GET' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		return json(res, 200, data.userData[params.uid].workoutLogs);
	}

	// POST /api/users/:uid/workout-logs
	params = matchPath('/api/users/:uid/workout-logs', url);
	if (method === 'POST' && params) {
		const body = await readBody(req);
		const data = readData();
		ensureUserData(data, params.uid);
		const item = {id: randomUUID(), ...body};
		data.userData[params.uid].workoutLogs.push(item);
		writeData(data);
		return json(res, 201, item);
	}

	// DELETE /api/users/:uid/workout-logs/:id
	params = matchPath('/api/users/:uid/workout-logs/:id', url);
	if (method === 'DELETE' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		data.userData[params.uid].workoutLogs = data.userData[params.uid].workoutLogs.filter(l => l.id !== params.id);
		writeData(data);
		return json(res, 200, {ok: true});
	}

	// GET /api/users/:uid/run-logs
	params = matchPath('/api/users/:uid/run-logs', url);
	if (method === 'GET' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		return json(res, 200, data.userData[params.uid].runLogs);
	}

	// POST /api/users/:uid/run-logs
	params = matchPath('/api/users/:uid/run-logs', url);
	if (method === 'POST' && params) {
		const body = await readBody(req);
		const data = readData();
		ensureUserData(data, params.uid);
		const item = {id: randomUUID(), ...body};
		data.userData[params.uid].runLogs.push(item);
		writeData(data);
		return json(res, 201, item);
	}

	// DELETE /api/users/:uid/run-logs/:id
	params = matchPath('/api/users/:uid/run-logs/:id', url);
	if (method === 'DELETE' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		data.userData[params.uid].runLogs = data.userData[params.uid].runLogs.filter(r => r.id !== params.id);
		writeData(data);
		return json(res, 200, {ok: true});
	}

	// GET /api/users/:uid/goals
	params = matchPath('/api/users/:uid/goals', url);
	if (method === 'GET' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		return json(res, 200, data.userData[params.uid].goals);
	}

	// PUT /api/users/:uid/goals
	params = matchPath('/api/users/:uid/goals', url);
	if (method === 'PUT' && params) {
		const body = await readBody(req);
		const data = readData();
		ensureUserData(data, params.uid);
		data.userData[params.uid].goals = body;
		writeData(data);
		return json(res, 200, data.userData[params.uid].goals);
	}

	// GET /api/users/:uid/favorites
	params = matchPath('/api/users/:uid/favorites', url);
	if (method === 'GET' && params) {
		const data = readData();
		ensureUserData(data, params.uid);
		return json(res, 200, data.userData[params.uid].favorites);
	}

	// PUT /api/users/:uid/favorites
	params = matchPath('/api/users/:uid/favorites', url);
	if (method === 'PUT' && params) {
		const body = await readBody(req);
		const data = readData();
		ensureUserData(data, params.uid);
		data.userData[params.uid].favorites = body;
		writeData(data);
		return json(res, 200, data.userData[params.uid].favorites);
	}

	// GET /api/stores
	if (method === 'GET' && matchPath('/api/stores', url)) {
		const data = readData();
		return json(res, 200, data.stores);
	}

	// POST /api/stores
	if (method === 'POST' && matchPath('/api/stores', url)) {
		const body = await readBody(req);
		if (!body?.name?.trim()) return badRequest(res, 'name required');
		const data = readData();
		const item = {id: randomUUID(), name: body.name.trim()};
		data.stores.push(item);
		writeData(data);
		return json(res, 201, item);
	}

	// PUT /api/stores/:id
	params = matchPath('/api/stores/:id', url);
	if (method === 'PUT' && params) {
		const body = await readBody(req);
		const data = readData();
		const idx = data.stores.findIndex(s => s.id === params.id);
		if (idx === -1) return notFound(res);
		data.stores[idx] = {...data.stores[idx], ...body, id: params.id};
		writeData(data);
		return json(res, 200, data.stores[idx]);
	}

	// DELETE /api/stores/:id
	params = matchPath('/api/stores/:id', url);
	if (method === 'DELETE' && params) {
		const data = readData();
		data.stores = data.stores.filter(s => s.id !== params.id);
		writeData(data);
		return json(res, 200, {ok: true});
	}

	// GET /api/prices
	if (method === 'GET' && matchPath('/api/prices', url)) {
		const data = readData();
		return json(res, 200, data.prices);
	}

	// POST /api/prices
	if (method === 'POST' && matchPath('/api/prices', url)) {
		const body = await readBody(req);
		if (!body?.productId || !body?.storeId || !body?.price || !body?.date) {
			return badRequest(res, 'productId, storeId, price, date required');
		}
		const data = readData();
		const item = {id: randomUUID(), ...body};
		data.prices.push(item);
		writeData(data);
		return json(res, 201, item);
	}

	// PUT /api/prices/:id
	params = matchPath('/api/prices/:id', url);
	if (method === 'PUT' && params) {
		const body = await readBody(req);
		const data = readData();
		const idx = data.prices.findIndex(p => p.id === params.id);
		if (idx === -1) return notFound(res);
		data.prices[idx] = {...data.prices[idx], ...body, id: params.id};
		writeData(data);
		return json(res, 200, data.prices[idx]);
	}

	// DELETE /api/prices/:id
	params = matchPath('/api/prices/:id', url);
	if (method === 'DELETE' && params) {
		const data = readData();
		data.prices = data.prices.filter(p => p.id !== params.id);
		writeData(data);
		return json(res, 200, {ok: true});
	}

	// GET /api/store
	if (method === 'GET' && matchPath('/api/store', url)) {
		const data = readData();
		return json(res, 200, data);
	}

	// POST /api/store
	if (method === 'POST' && matchPath('/api/store', url)) {
		let body;
		try {
			body = await readBody(req);
		} catch {
			return badRequest(res, 'Invalid JSON');
		}
		if (!body || !Array.isArray(body.users)) {
			return badRequest(res, 'Invalid store — expected users array');
		}
		writeData(body);
		return json(res, 200, {ok: true});
	}

	// All unmatched /api/* requests
	return notFound(res);
}

createServer(async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

	if (req.method === 'OPTIONS') {
		res.writeHead(204);
		return res.end();
	}

	if (!isAuthorized(req)) {
		res.writeHead(401, {'WWW-Authenticate': 'Basic realm="FitTrack"'});
		return res.end('Unauthorized');
	}

	const urlPath = new URL(req.url, 'http://x').pathname;

	if (urlPath.startsWith('/api')) {
		try {
			await handleApi(req, res);
		} catch (err) {
			console.error('API error:', err);
			if (!res.headersSent) {
				json(res, 500, {error: 'Internal server error'});
			}
		}
		return;
	}

	if (!DIST_EXISTS) return json(res, 503, {error: 'Frontend not built — run npm run build'});
	const filePath = join(DIST, urlPath);
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
