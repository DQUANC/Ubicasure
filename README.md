# Ubicasure

A location-based emergency service station finder for Guatemala. Users can view police and fire stations on an interactive Google Map, see station details (address, phone, hours, rating), and administrators can manage station data.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 19, Google Maps API, Firebase Hosting |
| Backend | Node.js 22+, Express 4, MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Database | MongoDB (Atlas or local via Docker) |
| Package manager | pnpm (workspace monorepo) |

## Project Structure

```
ubicasure/
├── back/                  # Express REST API (port 3200)
│   ├── configs/           # App setup (CORS, helmet, rate-limit, routes) and MongoDB connection
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/      # JWT auth + ensureAuth middleware
│   │   └── utils/
│   ├── .env               # Local secrets (gitignored)
│   ├── .env.example       # Template for secrets
│   ├── Dockerfile
│   └── index.js
├── front/                 # Angular 19 SPA (port 4200)
│   └── src/app/
│       ├── components/    # 14 route components
│       ├── guards/
│       ├── models/
│       └── services/      # HttpClient services + AuthStorageService
├── scripts/               # Dev tooling (auto-commit, auto-pr, auto-jira, dashboard)
├── .github/workflows/     # GitHub Actions CI/CD
├── .husky/                # Git hooks
├── docker-compose.yml     # Local dev (backend + MongoDB)
├── pnpm-workspace.yaml    # pnpm monorepo config
└── package.json           # Root scripts
```

## Prerequisites

- Node.js 22+
- pnpm 9+: `npm install -g pnpm`
- Angular CLI 19: `pnpm add -g @angular/cli@19`
- MongoDB (Railway service, MongoDB Atlas, or local via Docker)
- Google Maps API key with Maps JavaScript API enabled

## Setup

**1. Clone and install dependencies**

```bash
git clone <repo-url>
cd ubicasure
pnpm install
```

**2. Configure environment variables**

```bash
cp back/.env.example back/.env
```

Fill in `back/.env` with your values:

```
MONGO_URI=mongodb://localhost:27017/ubicasure
JWT_SECRET=your-secret-here
ADMIN_PASSWORD=your-admin-password
PORT=3200
```

Update `front/src/environments/environment.ts` with your Google Maps and Firebase keys.

**3. Run in development**

```bash
pnpm run dev          # Starts both backend (3200) and frontend (4200) concurrently
pnpm run dev:back     # Backend only
pnpm run dev:front    # Frontend only
```

## Docker (alternative local setup)

Starts the backend and a MongoDB instance together — no local MongoDB installation needed.

```bash
cp back/.env.example back/.env
# Set MONGO_URI=mongodb://mongodb:27017/ubicasure in back/.env
docker-compose up
```

The Angular frontend still runs separately with `pnpm run dev:front`.

## API Endpoints

All station endpoints require an `Authorization: <token>` header.

### Auth (`/user`)

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/user/register` | Public | Register a new user |
| POST | `/user/login` | Public | Login, returns JWT (rate-limited) |

### Stations (`/station`)

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/station/getStations` | Auth | All stations |
| GET | `/station/getPoliceStations` | Auth | Police stations |
| GET | `/station/getNationalStationsP` | Auth | National police |
| GET | `/station/getMunicipalStationsP` | Auth | Municipal police |
| GET | `/station/getFireStations` | Auth | Fire stations |
| GET | `/station/getMunicipalStationsF` | Auth | Municipal fire dept |
| GET | `/station/getVolunteerStationsF` | Auth | Volunteer fire dept |
| POST | `/station/createStation` | Admin | Create station |
| PUT | `/station/updateStation/:id` | Admin | Update station |
| DELETE | `/station/deleteStation/:id` | Admin | Delete station |

## Frontend Routes

| Path | Guard | Description |
|---|---|---|
| `/` | Public | Home |
| `/login` | Public | Login |
| `/register` | Public | Registration |
| `/mapa` | Auth | Interactive map (main view) |
| `/estacionesPolicia` | Auth | Police station list |
| `/estacionesBomberos` | Auth | Fire station list |

## Roles

| Role | Capabilities |
|---|---|
| `CLIENT` | View stations and map |
| `ADMIN` | View + create, update, delete stations |

## Development Scripts

Available from the repo root via `pnpm run <script>`:

| Script | Description |
|---|---|
| `dev` | Start both servers concurrently |
| `dev:back` | Start backend only |
| `dev:front` | Start frontend only |
| `build` | Angular production build |
| `build:all` | Build Angular, then start Express to serve it |
| `start` | Start backend only (production) |
| `test` | Run tests across all workspace packages |
| `lint` | Run Angular lint |
| `type-check` | TypeScript type check |
| `auto-commit` | Automated commit helper (scripts/auto-commit.js) |
| `auto-pr` | Automated PR creation (scripts/auto-pr.js) |
| `auto-jira` | Automated Jira Epic/Story creation (scripts/auto-jira.js) |
| `dashboard` | Dev progress dashboard (scripts/dashboard.js) |

## Deployment

### Backend (pending Railway migration)

The Heroku free tier was discontinued in November 2022. Migration to Railway is planned — see `update-plan.md`.

For a unified deploy (Express serves the Angular build):

```bash
pnpm run build:all
```

Set the required environment variables (`MONGO_URI`, `JWT_SECRET`, `ADMIN_PASSWORD`, `PORT`) in your hosting provider's dashboard.

### Frontend (Firebase Hosting)

Firebase project: `propuestaestaciones`

```bash
cd front
ng build                     # Outputs to dist/map
firebase deploy              # Deploy to Firebase Hosting
```

## Geographic Constraint

Stations are restricted to the San Salvador metropolitan area (lat 14.53-14.68, lng -90.64 to -90.47). This is enforced server-side in the station controller.

## Contributing

See `update-plan.md` for the prioritized improvement backlog before adding new features.
