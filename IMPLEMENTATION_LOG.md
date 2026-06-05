# Ubicasure — Implementation Log

## Phase 1 — P0 Blockers

### 2026-06-04 1.1 Secrets moved to environment variables

- Installed `dotenv` in `back/`
- Added `require('dotenv').config()` as the first line of `back/index.js`
- `back/configs/mongoConfigs.js` — replaced hardcoded Atlas URI with `process.env.MONGO_URI`
- `back/src/services/jwt.js` — replaced hardcoded `'Proyecto_Final'` with `process.env.JWT_SECRET` (done as part of the jwt-simple migration in 2.1)
- `back/src/services/authenticated.js` — replaced hardcoded `'Proyecto_Final'` with `process.env.JWT_SECRET` (done as part of the jwt-simple migration in 2.1)
- `back/src/controllers/user.controller.js` — replaced hardcoded `'123456'` admin password with `process.env.ADMIN_PASSWORD || '123456'`
- Created `back/.env.example` with all required variable names and placeholder values
- Created `back/.env` (gitignored via root `.gitignore`) — fill in real values before deploying
- Status: DONE

### 2026-06-04 1.2 bcrypt-nodejs replaced with bcryptjs

- Ran `npm uninstall bcrypt-nodejs && npm install bcryptjs` in `back/`
- `back/src/utils/validate.js`:
  - Changed `require('bcrypt-nodejs')` to `require('bcryptjs')`
  - Changed `bcrypt.hashSync(password)` (old 3-arg signature) to `bcrypt.hashSync(password, 10)`
  - `bcrypt.compareSync(password, hash)` call was already compatible — no change needed
- Status: DONE

### 2026-06-04 1.3 CORS restricted to known origins

- `back/configs/app.js` — replaced `app.use(cors())` with an explicit allow-list:
  - `http://localhost:4200` (local dev)
  - `https://propuestaestaciones.web.app` (Firebase Hosting)
  - `https://propuestaestaciones.firebaseapp.com` (Firebase Hosting alternate)
  - Methods: GET, POST, PUT, DELETE
  - Allowed headers: Content-Type, Authorization
- Status: DONE

---

## Phase 2 — P1 Modernization

### 2026-06-04 2.1 jwt-simple replaced with jsonwebtoken

- Ran `npm uninstall jwt-simple && npm install jsonwebtoken` in `back/`
- `back/src/services/jwt.js` — complete rewrite:
  - Changed `require('jwt-simple')` to `require('jsonwebtoken')`
  - Removed `moment` dependency (expiry handled natively by jsonwebtoken)
  - Changed `jwt.encode(payload, secretKey)` to `jwt.sign(payload, secretKey, { expiresIn: '24h' })`
  - Removed manual `iat`/`exp` fields from payload (jsonwebtoken sets these automatically)
  - Secret now read from `process.env.JWT_SECRET`
- `back/src/services/authenticated.js` — complete rewrite:
  - Changed `require('jwt-simple')` to `require('jsonwebtoken')`
  - Removed `moment` dependency
  - Changed `jwt.decode(token, secretKey)` to `jwt.verify(token, secretKey)`
  - Removed manual `payload.exp <= moment().unix()` check (jwt.verify throws `TokenExpiredError` automatically)
  - Added distinct error handling for `TokenExpiredError` vs invalid token
  - Secret now read from `process.env.JWT_SECRET`
- Status: DONE

### 2026-06-04 2.2 body-parser removed, Express built-ins used

- Ran `npm uninstall body-parser` in `back/` (was a direct dependency; still present as Express 4 transitive dep but no longer in package.json)
- `back/configs/app.js`:
  - Removed `const bodyParser = require('body-parser')`
  - Replaced `app.use(bodyParser.urlencoded({ extended: false }))` with `app.use(express.urlencoded({ extended: false }))`
  - Replaced `app.use(bodyParser.json())` with `app.use(express.json())`
- Status: DONE

### 2026-06-04 2.3 moment.js removed (no date-fns needed)

- Checked all files under `back/src/` for moment usage
- Found usage only in `back/src/services/jwt.js` and `back/src/services/authenticated.js` — both were rewritten in 2.1 to use jsonwebtoken's native expiry instead
- Ran `npm uninstall moment` in `back/`
- date-fns not installed — no remaining date manipulation needed in the backend
- Status: DONE

### 2026-06-04 2.4 Rate limiting added on login endpoint

- Installed `express-rate-limit` in `back/`
- `back/configs/app.js`:
  - Added `const rateLimit = require('express-rate-limit')`
  - Created `loginLimiter`: 20 requests per 15-minute window
  - Applied as `app.use('/user/login', loginLimiter)` before the user router
- Status: DONE

### 2026-06-04 2.5 Deprecated Mongoose option removed

- `back/configs/mongoConfigs.js` — removed `useNewUrlParser: true` from the `mongoose.connect()` options object (deprecated in Mongoose 6, removed in Mongoose 7)
- Status: DONE

### 2026-06-04 2.6 Node.js engines field added

- `back/package.json` — added `"engines": { "node": ">=22.0.0" }` to declare the minimum Node.js version requirement (Node 22 LTS)
- Status: DONE

---

## Package Manager Migration — npm → pnpm

### 2026-06-04 Migrated entire monorepo to pnpm

- Created `pnpm-workspace.yaml` at root declaring `back` and `front` as workspace packages
- `package.json` (root):
  - Added `"packageManager": "pnpm@9.0.0"` field
  - `install:all` script simplified from multi-step `npm install` chain → `pnpm install` (workspace handles all packages)
  - `dev` script: `npm run` → `pnpm run`
- Deleted `package-lock.json` from root, `back/`, and `front/`
- `.gitignore` — added `package-lock.json` and `yarn.lock` to prevent npm/yarn lock files from being committed
- Run `pnpm install` at the repo root to generate `pnpm-lock.yaml`
- Status: DONE

---

## Phase 3 — Frontend Modernization

### 2026-06-05 3.1 Angular 14 upgraded to Angular 19 (incremental)

- Upgraded one major version at a time using `npx @angular/cli@X update @angular/core@X @angular/cli@X --force --allow-dirty` run from `front/`
- Upgrade path: 14 → 15 → 16 → 17 → 18 → 19
- At each step, `pnpm install` was run from the repo root to sync the lockfile
- Related package changes per version:
  - Angular 15: TypeScript 4.7 → 4.9
  - Angular 16: zone.js 0.11 → 0.13, TypeScript stays 4.9
  - Angular 17: TypeScript 4.9 → 5.4, zone.js 0.13 → 0.14; Angular 17 migration renamed `browserTarget` to `buildTarget` in angular.json
  - Angular 18: TypeScript stays 5.4; Angular 18 migration replaced `HttpClientModule` with `provideHttpClient(withInterceptorsFromDi())` in `app.module.ts`
  - Angular 19: TypeScript 5.4 → 5.8, zone.js 0.14 → 0.15; Angular 19 migration added `standalone: false` to all component decorators
- `@angular/fire` updated: 7 → 16 → 18 → 19.2.0 (compat module still available)
- `@angular/google-maps` updated: 14 → 16 → 18 → 19
- `firebase` updated: 9 → 10 → 11.8.0 (to match @angular/fire@19 direct dependency)
- `rxjs` updated: 7.5 → 7.8 (required by @angular/fire@19)
- `tsconfig.json`: added `skipLibCheck: true` (resolves TS2694 in @angular/google-maps visualization types); set `target`/`module` to ES2022
- `angular.json`: production bundle budget updated to 800KB warning / 2MB error (larger baseline from Firebase + Maps + Angular 19)
- Status: DONE

### 2026-06-05 3.2 axios removed — services already use Angular HttpClient

- Confirmed `front/src/app/services/userRest/user-rest.service.ts` and `stationRest/station-rest.service.ts` both already imported `HttpClient` from `@angular/common/http` — no code changes needed
- Removed `axios: ^0.27.2` from `front/package.json` dependencies
- Cleaned unused `AngularFireAuth` and `firebase` compat imports from `stationRest` service (they were injected but never called)
- Status: DONE

### 2026-06-05 3.3 Token storage moved: localStorage → in-memory AuthStorageService

- Created `front/src/app/services/auth-storage/auth-storage.service.ts`:
  - Injectable service with `token: string` and `identity: any` private fields
  - Methods: `getToken()`, `setToken()`, `clearToken()`, `getIdentity()`, `setIdentity()`, `clearIdentity()`, `clearAll()`
- `front/src/app/services/userRest/user-rest.service.ts`:
  - Injected `AuthStorageService` replacing direct localStorage access
  - `getToken()` and `getIdentity()` now delegate to `AuthStorageService`
  - `logOut()` calls `authStorage.clearAll()` then Firebase signOut
- `front/src/app/components/login/login.component.ts`:
  - Injected `AuthStorageService`
  - Replaced `localStorage.setItem('token', ...)` and `localStorage.setItem('identity', ...)` with `authStorage.setToken()` / `authStorage.setIdentity()`
- `front/src/app/components/navbar/navbar.component.ts`:
  - Injected `AuthStorageService`
  - Replaced `localStorage.clear()` in `logOut()` with `authStorage.clearAll()`
  - Token polling uses `authStorage.getToken()` instead of direct localStorage
- Status: DONE

### 2026-06-05 3.4 Input validation added on frontend forms

- `front/src/app/components/login/login.component.html`:
  - `#loginForm="ngForm"` added to `<form>`, submit disabled when `loginForm.invalid`
  - Username: `required`, `minlength="3"` with inline validation messages
  - Password: `required`, `minlength="8"` with inline validation messages
- `front/src/app/components/register/register.component.html`:
  - Name: `required`, `minlength="2"`
  - Username: `required`, `minlength="3"`
  - Email: `required`, `email` validator (Angular built-in)
  - Password: `required`, `minlength="8"`
  - Phone (new field): `pattern="^[0-9\+\-\s]{7,15}$"` (optional)
  - All fields show `*ngIf` driven error messages when `invalid && touched`
- `front/src/app/components/mapa-general/mapa-general.component.html`:
  - Station name: `required`, `minlength="2"`
  - Type: `required` on select
  - Phone: `required`, `pattern` 7–15 digits
  - Address: `required`
  - Rating: `required`, `min=0`, `max=5`
  - Business hours: `required`
  - Lat/lng out-of-bounds message shown when user clicks outside San Salvador
  - Save button disabled when `createStationForm.invalid || latLngOutOfBounds()`
- `front/src/app/components/mapa-general/mapa-general.component.ts`:
  - Added `latLngOutOfBounds()` method: returns `true` when lat/lng are set but outside bounds (lat 14.53–14.68, lng -90.64 to -90.47)
- Status: DONE

### 2026-06-05 3.5 Karma/Jasmine replaced with Jest

- Removed from `front/package.json` devDependencies: `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`, `jasmine-core`, `@types/jasmine`
- Added to `front/package.json` devDependencies: `jest@^29.7.0`, `@types/jest@^29.5.0`, `jest-environment-jsdom@^29.7.0`, `jest-preset-angular@^14.0.0`, `@angular-builders/jest@^19.0.0`
- `front/package.json` test script changed from `ng test` to `jest`
- Deleted `front/karma.conf.js` and `front/src/test.ts`
- Created `front/jest.config.js` with `jest-preset-angular` preset, jsdom environment, TypeScript transform, and `src/` path mapping
- Created `front/setup-jest.ts` importing `jest-preset-angular/setup-jest`
- `front/tsconfig.spec.json`: removed `jasmine` from types, added `jest` and `node`; removed `files` pointing to deleted test.ts; added `setup-jest.ts` to include
- `front/angular.json` test builder changed from `@angular-devkit/build-angular:karma` to `@angular-builders/jest:run` pointing at `jest.config.js`
- Status: DONE

---

## Phase 4 — Infrastructure and DevOps

### 2026-06-05 4.1 GitHub Actions CI/CD workflow created

- Created `.github/workflows/ci.yml` at repo root
- Two jobs: `backend` and `frontend`, each running on `ubuntu-latest`
- Both jobs: checkout → Node 22 setup → pnpm 9 setup → `pnpm install --frozen-lockfile`
- Backend job: runs `pnpm --filter propuesta-back test`
- Frontend job: runs `pnpm --filter map run build`
- Triggers: push and pull_request to `master`/`main`
- Status: DONE

### 2026-06-05 4.2 Docker Compose for local development

- Created `back/Dockerfile`: node:22-alpine, installs pnpm, runs `pnpm install --prod`, exposes port 3200, starts with `node index.js`
- Created `docker-compose.yml` at repo root:
  - `backend` service: builds from `./back`, maps port 3200:3200, loads `back/.env`
  - `mongodb` service: mongo:7 image, maps port 27017:27017, uses named volume `mongo_data`
- Status: DONE

### 2026-06-05 4.3 Unified deployment config — Express serves Angular SPA

- `back/configs/app.js`:
  - Added `const path = require('path')` at top
  - After all API routes: `app.use(express.static(distPath))` where `distPath = path.join(__dirname, '../../front/dist/map')`
  - Added `app.get('*', ...)` catch-all that serves `index.html` for client-side routing (only active once Angular build exists)
- `package.json` (root): added `"build:all"` script: `pnpm --filter map run build && pnpm run start`
- Status: DONE
