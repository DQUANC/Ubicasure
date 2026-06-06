# CLAUDE.md — Ubicasure

## What This Project Is

Ubicasure is a full-stack monorepo — an Angular 14 SPA (`front/`) backed by an Express + MongoDB REST API (`back/`). It lets users find and manage emergency service stations (police and fire) in Guatemala on an interactive Google Map.

## Running Locally

```bash
npm run install:all   # Install deps in root, back/, and front/
npm run dev           # Start both servers with concurrently
```

- Backend: http://localhost:3200
- Frontend: http://localhost:4200

## Architecture

```
back/
  index.js              — entry point: init Mongo, start server, seed admin
  configs/app.js        — Express setup (CORS, helmet, body-parser, routes)
  configs/mongoConfigs.js — Mongoose connection
  src/controllers/      — business logic (user, station)
  src/models/           — Mongoose schemas (user, station)
  src/routes/           — route definitions
  src/services/jwt.js   — token creation/validation (jwt-simple)
  src/services/authenticated.js — ensureAuth middleware
  src/utils/validate.js — input validation helpers

front/src/app/
  app-routing.module.ts — all routes, UserGuard applied
  guards/userGuard/     — checks localStorage for token
  services/userRest/    — auth API calls (register, login)
  services/stationRest/ — station CRUD API calls
  components/           — 14 components (map, login, register, station lists…)
  environments/         — baseUri and Firebase/Maps API keys
```

## Important Constraints

- **Geographic fence**: Stations are limited to San Salvador, El Salvador (lat 13.55–13.85, lng -89.35 to -89.05). The backend enforces this in the station controller.
- **Roles**: `ADMIN` can create/update/delete stations; `CLIENT` can only view. Role is stored in the JWT payload.
- **Token handling**: JWT is stored in `localStorage` under the key `token`; user identity under `identity`. Services read these directly.
- **Station immutability**: Once created, `user`, `address`, `lat`, `lng` cannot be updated — the controller explicitly blocks this in `updateStation`.

## Known Hardcoded Values to Fix

| File | Value | Should become |
|---|---|---|
| `back/configs/mongoConfigs.js:7` | MongoDB URI string | `process.env.MONGO_URI` |
| `back/src/services/jwt.js` | `'Proyecto_Final'` | `process.env.JWT_SECRET` |
| `back/src/services/authenticated.js` | `'Proyecto_Final'` | `process.env.JWT_SECRET` |
| `back/src/controllers/user.controller.js` | Default admin password | `process.env.ADMIN_PASSWORD` |
| `front/src/environments/environment*.ts` | Firebase + Maps keys | `.env` injected at build |

Never commit real secrets. Use `.env` (gitignored) and `.env.example` as the template.

## Deprecated Dependencies (fix before next deploy)

| Package | Problem | Replace with |
|---|---|---|
| `bcrypt-nodejs` | Unmaintained since 2017 | `bcryptjs` |
| `jwt-simple` | Minimal, rarely updated | `jsonwebtoken` |
| `moment` | In maintenance mode | `date-fns` or `Day.js` |
| `body-parser` | Built into Express 4.16+ | `express.json()` / `express.urlencoded()` |
| Angular 14 | EOL; no security patches | Angular 19 |

## Deployment Status

- **Backend** was on Heroku (free tier — discontinued Nov 2022). Needs migration to Railway, Render, or Fly.io.
- **Frontend** is on Firebase Hosting (project: `propuestaestaciones`). Still valid.
- See `update-plan.md` for migration details.

## Testing

No tests exist yet. Backend has a placeholder test script. Frontend has Karma/Jasmine wired but no spec files written. See `update-plan.md` Phase 3 for the testing strategy.

## Common Tasks

**Add a new station type**
1. Add the type string to `back/src/models/station.model.js` (type enum if applicable)
2. Add a route in `back/src/routes/station.routes.js` and handler in the controller
3. Add a marker icon to `front/src/assets/`
4. Add a case in `mapa-general.component.ts` marker switch
5. Add a new Angular component and route in `app-routing.module.ts`

**Change geographic bounds**
Edit the lat/lng validation in `back/src/controllers/station.controller.js`. Bounds are currently hardcoded constants at the top of the file.

**Check the default admin credentials**
Set in `back/src/controllers/user.controller.js` inside `createAdmin()`. Username: `SuperAdmin`, password from env (currently hardcoded as `123456`).
