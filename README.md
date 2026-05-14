# FitTrack

Personal fitness tracker for two users (Tim & Davine). Supports daily food logging, macro tracking, weight, workouts, and grocery price comparison. Products and recipes are shared; food logs, weight, workouts, and goals are per-user. Data is persisted server-side in a single `data.json` file.

## Stack

- React 19 + TypeScript — TanStack Router (file-based), TanStack React Query, Recharts
- Zustand — user selection only (`activeUserId` persisted to `localStorage`)
- Zero-dependency Node.js HTTP server (`server.mjs`) — serves the built frontend and a `/api/*` REST layer
- Built with Rspack

---

## Features

### Log
Daily food entries grouped by meal time (Morning / Lunch / In-Between / Evening / Snack).

| Entry type | How it works |
|---|---|
| **Product** | Select a saved product, enter grams (or servings). Hover a row to reveal a *↓ custom* action that converts the entry in-place. |
| **Recipe** | Select a recipe by searchable name, enter grams. Works for both ingredient-based and quick recipes. |
| **Custom** | Type a description + total macros directly. For restaurant meals or one-off estimates — never pollutes the product list. |

Converting a product entry to custom bakes in the calculated macros. Optionally deletes the product from the shared list, in which case all other log entries referencing it (across both users) are also migrated to custom entries automatically.

### Products
Shared product database with per-100g macros and optional serving sizes (e.g. "1 slice = 30g"). Duplicate detection warns you — with the existing product's macros — when a name you're typing is already in the list.

### Recipes
Two recipe types:

- **Ingredient-based** — add products with amounts; macros are derived from ingredients.
- **Quick recipe** — enter per-100g macros directly, no ingredient breakdown needed. Useful for recurring restaurant dishes or labelled ready-made meals.

Both types appear in the same searchable recipe picker on the Log page, tagged *quick* where applicable.

### Reports
- Body weight chart with a linear trend line.
- Daily macro summary.

### Grocery
- Log product prices per store, with optional promo/regular price distinction.
- **Price History** table with searchable product and store filters.
- **Compare Stores** tab:
  - *Current prices* — bar chart of latest regular price per store for a selected product.
  - *Evolution* — line chart of full price history per store for a selected product.
- **Store index** — horizontal bar chart of each store's average price premium above the cheapest option, across all comparable products. Toggle to *Over time* to see that index evolve as prices were logged.

### Training
Log workouts against saved routines and exercises, track sets/reps/weight.

---

## Local development

Two terminals — the Rspack dev server handles the frontend with hot reload on port 9005, and `server.mjs` handles the API on port 3001. The dev server proxies all `/api/*` requests to port 3001.

**Terminal 1 — API server:**
```bash
node server.mjs
```

**Terminal 2 — frontend with hot reload:**
```bash
npm install
npm run dev       # http://localhost:9005
```

Auth is disabled when `AUTH_USER` / `AUTH_PASS` are not set, so no `.env` is needed locally.

### Running with auth locally

1. Create a `.env` file in the project root:
   ```
   AUTH_USER=yourname
   AUTH_PASS=yourpassword
   PORT=3001
   ```
2. ```bash
   npm run build
   npm run serve   # http://localhost:3001
   ```

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

**5. Set secrets**

```bash
flyctl secrets set AUTH_USER=yourname AUTH_PASS=yourpassword
```

**6. Deploy**

```bash
npm run deploy
```

The app will be live at **https://tcfittrack.fly.dev**.

### Ongoing deploys

```bash
npm run deploy    # build Docker image and deploy to Fly.io
npm run logs      # stream live logs from the running machine
```

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

## Backup / restore

Use **Export Backup** on the Products page to download a full JSON snapshot. Use **Import Backup** to restore it on any instance. Do this before a destructive redeploy if needed.

---

## Project structure

```
server.mjs              Node.js HTTP server (static files + REST API)
fly.toml                Fly.io deployment config
Dockerfile              Multi-stage build
src/
  routes/               Page-level components (TanStack Router file-based routing)
  components/           UI and feature components
    grocery/            Price logging and store comparison
    log/                Daily food log entry forms and rows
    products/           Product form and list
    recipes/            Recipe editor and quick recipe editor
    report/             Charts for weight and macros
    ui/                 Shared UI primitives (Button, Card, Field, DataTable, …)
  hooks/                React Query wrappers (useApi) and feature hooks
  utils/                Pure helpers — macros, serving, price calculations, backup
  types/                Shared TypeScript interfaces (LogEntry, Product, Recipe, …)
```
