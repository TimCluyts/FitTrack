# FitTrack

Personal fitness tracker for logging nutrition, weight, and training. Supports multiple users (shared products/recipes, separate logs per user). Data is persisted server-side in a JSON file.

## Stack

- React 19 + TypeScript, TanStack Router, Zustand, Recharts
- Zero-dependency Node.js HTTP server (`server.mjs`)
- Built with Rspack

---

## Local development

```bash
npm install
npm run dev       # dev server on http://localhost:9005 (hot reload)
```

### Running the production server locally

1. Create a `.env` file in the project root:
   ```
   AUTH_USER=yourname
   AUTH_PASS=yourpassword
   PORT=3001
   ```
2. Build and serve:
   ```bash
   npm run build
   npm run serve   # http://localhost:3001
   ```

> Auth is disabled when `AUTH_USER`/`AUTH_PASS` are not set, so you can skip the `.env` for local dev.

---

## Deploy to Fly.io

### One-time setup

**1. Install flyctl**

```bash
# Windows
winget install flyctl

# macOS
brew install flyctl
```

**2. Log in**

```bash
flyctl auth login
```

**3. Create the app** (app name `tcfittrack` is already in `fly.toml`)

```bash
flyctl apps create tcfittrack
```

**4. Create the persistent volume** (stores `data.json` across deploys)

```bash
flyctl volumes create fittrack_data --region ams --size 1
```

**5. Set secrets** (stored securely on Fly, never in any file)

```bash
flyctl secrets set AUTH_USER=yourname AUTH_PASS=yourpassword
```

**6. Deploy**

```bash
npm run deploy
```

The app will be live at **https://tcfittrack.fly.dev**.

---

### Ongoing deploys

```bash
npm run deploy    # build Docker image and deploy to Fly.io
npm run logs      # stream live logs from the running machine
```

---

### How it works on Fly.io

| What | Detail |
|---|---|
| Build | Multi-stage Dockerfile — builder installs deps and runs `npm run build`, final image copies only `.build/` + `server.mjs` |
| Data | `data.json` lives on a persistent Fly volume mounted at `/data`, survives redeploys |
| Auth | HTTP Basic Auth — browser shows a login dialog on first visit |
| HTTPS | Handled automatically by Fly.io (Let's Encrypt) |
| Region | Amsterdam (`ams`) |
| Machine | shared-cpu-1x, 256 MB RAM (within Fly free tier) |

---

## Backup / restore data

Use the **Export Backup** button in the app to download a full JSON snapshot. Use **Import Backup** to restore it on any instance. Do this before a destructive redeploy if needed.

---

## Project structure

```
server.mjs              Node.js HTTP server (static files + /api/data)
fly.toml                Fly.io deployment config
Dockerfile              Multi-stage build
src/
  routes/               Page components (TanStack Router file-based routing)
  components/           UI + domain components
  store/                Zustand stores (nutrition, log, weight, training, user)
  hooks/                Shared logic hooks
  utils/                Helpers (macros, backup, server sync)
  types/                Shared TypeScript types
```
