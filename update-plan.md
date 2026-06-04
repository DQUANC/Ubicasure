# Ubicasure — Update Plan

The project was originally built ~2021–2022. This plan tracks what needs to change before it can be reliably deployed and maintained in 2026. Items are grouped by urgency, not technology.

---

## Phase 1 — Fix Blockers (do before any new deploy)

These are blocking issues: the app either won't run correctly without fixing them, or it poses unacceptable security risk.

### 1.1 Move all secrets out of source code

**Status:** Not done  
**Impact:** Security — credentials are committed to git history

Files to change:

| File | Hardcoded value | Action |
|---|---|---|
| `back/configs/mongoConfigs.js:7` | MongoDB Atlas URI | `process.env.MONGO_URI` |
| `back/src/services/jwt.js` | JWT secret `'Proyecto_Final'` | `process.env.JWT_SECRET` |
| `back/src/services/authenticated.js` | JWT secret `'Proyecto_Final'` | `process.env.JWT_SECRET` |
| `back/src/controllers/user.controller.js` | Default admin password `'123456'` | `process.env.ADMIN_PASSWORD` |
| `front/src/environments/environment*.ts` | Firebase config + Google Maps key | Angular env vars or build-time injection |

Steps:
1. Create `back/.env` from `.env.example`
2. Install `dotenv` in `back/`: `npm install dotenv`
3. Add `require('dotenv').config()` as the first line of `back/index.js`
4. Replace each hardcoded value with `process.env.<VAR>`
5. For the frontend, look into `@angular/cli`'s environment file replacement at build time or use a build script that injects vars

### 1.2 Migrate backend off Heroku

**Status:** Blocking — Heroku free tier was discontinued November 2022. The backend at `https://propuesta-final.herokuapp.com/` is likely down.  

**Recommended: Railway** (simplest migration, free tier available)

Steps:
1. Create an account at [railway.app](https://railway.app)
2. Connect the GitHub repository
3. Set environment variables in Railway dashboard (from `.env.example`)
4. Railway auto-detects Node.js and runs `npm start`
5. Update `front/src/environments/environment.prod.ts` with the new Railway URL
6. Update CORS in `back/configs/app.js` to allow the Firebase Hosting origin explicitly

Alternatives:
- **Render**: `render.com` — similar simplicity, free tier
- **Fly.io**: More control, Docker-based, free tier
- **Self-host on VPS**: DigitalOcean / Hetzner if you want full control

### 1.3 Replace deprecated `bcrypt-nodejs`

**Status:** Blocking for security — `bcrypt-nodejs` has been unmaintained since 2017, has known issues with async behavior, and is not compatible with modern Node.js versions.

```bash
cd back
npm uninstall bcrypt-nodejs
npm install bcryptjs
```

The API is nearly identical. In `user.controller.js`:

```js
// Before
const bcrypt = require('bcrypt-nodejs');
bcrypt.hashSync(password, null, null)
bcrypt.compareSync(password, hash)

// After
const bcrypt = require('bcryptjs');
bcrypt.hashSync(password, 10)
bcrypt.compareSync(password, hash)
```

### 1.4 Fix CORS — restrict to known origins

Currently `app.use(cors())` allows any origin. Before deploying to production:

```js
// back/configs/app.js
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://propuestaestaciones.web.app',  // Firebase Hosting
    'https://propuestaestaciones.firebaseapp.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Phase 2 — Backend Modernization

These improve maintainability and security but don't block initial deployment.

### 2.1 Replace `jwt-simple` → `jsonwebtoken`

`jwt-simple` is minimally maintained. `jsonwebtoken` (the npm standard) has better error handling, algorithm specification, and active maintenance.

```bash
npm uninstall jwt-simple
npm install jsonwebtoken
```

```js
// Before (jwt-simple)
const jwt = require('jwt-simple');
const token = jwt.encode(payload, secret);
const decoded = jwt.decode(token, secret);

// After (jsonwebtoken)
const jwt = require('jsonwebtoken');
const token = jwt.sign(payload, secret, { expiresIn: '24h' });
const decoded = jwt.verify(token, secret);
```

### 2.2 Remove `body-parser` (built into Express)

`body-parser` functionality has been built into Express since v4.16 (2018). Remove the package and use the built-in parsers.

```bash
npm uninstall body-parser
```

```js
// Before
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// After
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
```

### 2.3 Replace `moment.js` → `date-fns`

`moment.js` is in maintenance mode and ships 67 KB minified. `date-fns` is tree-shakable and actively maintained.

```bash
npm uninstall moment
npm install date-fns
```

### 2.4 Add rate limiting

Prevents brute-force attacks on the login endpoint.

```bash
npm install express-rate-limit
```

```js
// back/configs/app.js
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/user/login', loginLimiter);
```

### 2.5 Upgrade Mongoose deprecated options

Remove deprecated Mongoose 6 options in `mongoConfigs.js`:

```js
// Remove useNewUrlParser — deprecated since Mongoose 6, removed in 7
mongoose.connect(uriMongo, {
  maxPoolSize: 15,
  connectTimeoutMS: 2500
  // remove useNewUrlParser: true
});
```

### 2.6 Upgrade Node.js to LTS

Target: **Node.js 22 LTS** (current LTS as of 2026).

Check `.nvmrc` or `engines` field in `back/package.json`:

```json
{
  "engines": {
    "node": ">=22.0.0"
  }
}
```

### 2.7 Upgrade dev tooling

```bash
cd back
npm install --save-dev nodemon@latest
```

---

## Phase 3 — Frontend Modernization

### 3.1 Upgrade Angular 14 → 19

Angular 14 reached end-of-life. Angular 19 (current LTS) includes:
- Standalone components (no NgModule)
- Signals for reactivity (replaces much of RxJS)
- `inject()` function (replaces constructor DI)
- Better SSR/hydration for SEO

**Migration path** (do incrementally, one major version at a time):

```bash
cd front
npx ng update @angular/core@15 @angular/cli@15
npx ng update @angular/core@16 @angular/cli@16
npx ng update @angular/core@17 @angular/cli@17
npx ng update @angular/core@18 @angular/cli@18
npx ng update @angular/core@19 @angular/cli@19
```

Run `ng update` to check for additional required updates at each step.

Also update related packages:
- `@angular/fire` 7 → 18 (matches Angular version)
- `@angular/google-maps` 14 → 19
- `rxjs` 7.5 → 7.8
- `typescript` 4.7 → 5.x
- `zone.js` → may be optional in Angular 19 with Signals

### 3.2 Replace `axios` → Angular `HttpClient`

The project already has `HttpClientModule` available via `@angular/common/http`. Using Angular's built-in `HttpClient` is preferred (interceptors, testing, RxJS integration).

```typescript
// Before
import axios from 'axios';
return axios.post(url, params);

// After
import { HttpClient } from '@angular/common/http';
return this.http.post(url, params);
```

### 3.3 Move token storage from localStorage → memory or HttpOnly cookies

`localStorage` is vulnerable to XSS. Options:
- **Memory storage** (service variable): Token lost on refresh but more secure
- **HttpOnly cookies**: Requires backend to set the cookie (`res.cookie()`), immune to JS XSS. Most secure.

For HttpOnly cookies, update the backend login endpoint to set `res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })` and remove the Authorization header pattern.

### 3.4 Add input validation on the frontend

Currently validation happens only in the backend. Add Angular reactive form validators for:
- Email format
- Password minimum length (8+ chars)
- Phone number format
- Required fields on station creation form

### 3.5 Replace Karma/Jasmine → Jest (optional but recommended)

Karma is deprecated. The Angular team now defaults to Jest.

```bash
npx ng add @analogjs/vitest-angular
# or
npm install --save-dev jest @angular-builders/jest
```

---

## Phase 4 — Infrastructure & DevOps

### 4.1 Add GitHub Actions CI/CD

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: cd back && npm ci && npm test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: cd front && npm ci && ng build
```

### 4.2 Add Docker for local development

Create `docker-compose.yml` at the root for a consistent dev environment:

```yaml
version: '3.8'
services:
  backend:
    build: ./back
    ports:
      - "3200:3200"
    env_file: ./back/.env

  frontend:
    build: ./front
    ports:
      - "4200:4200"
```

### 4.3 Consider unified deployment

Instead of two separate platforms (Railway for API, Firebase for SPA), you can serve the Angular build from Express:

```js
// back/configs/app.js (after ng build)
app.use(express.static(path.join(__dirname, '../front/dist/map')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../front/dist/map/index.html')));
```

This means one platform, one deployment, one URL. Particularly useful for Railway/Render where you pay per service.

### 4.4 Expand geographic coverage

Current station bounds are hard-coded to San Salvador metro area. If expanding to other regions of El Salvador, refactor the coordinate bounds into a config object or database setting rather than hardcoded constants in `station.controller.js`.

---

## Priority Order Summary

| Priority | Task | Effort |
|---|---|---|
| P0 | Move secrets to `.env` | 1h |
| P0 | Migrate backend off Heroku | 1–2h |
| P0 | Replace `bcrypt-nodejs` → `bcryptjs` | 30m |
| P0 | Restrict CORS origins | 30m |
| P1 | Replace `jwt-simple` → `jsonwebtoken` | 1h |
| P1 | Remove `body-parser` | 15m |
| P1 | Add rate limiting on login | 30m |
| P1 | Fix deprecated Mongoose options | 15m |
| P2 | Angular 14 → 19 upgrade (incremental) | 4–8h |
| P2 | Replace `axios` → `HttpClient` | 1–2h |
| P2 | Replace `moment` → `date-fns` | 30m |
| P3 | Token storage: localStorage → HttpOnly cookies | 2–3h |
| P3 | Add frontend form validation | 1–2h |
| P3 | GitHub Actions CI | 1h |
| P3 | Docker Compose dev setup | 1h |
| P4 | Unified deployment (Express serves Angular) | 1–2h |
| P4 | Karma → Jest migration | 1–2h |
