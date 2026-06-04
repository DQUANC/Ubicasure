# Ubicasure

## PENDING CICD DEPLOYMENT

A location-based emergency service station finder for Guatemala. Users can view police and fire stations on an interactive Google Map, see station details (address, phone, hours, rating), and administrators can manage station data.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 14, Google Maps API, Firebase Hosting |
| Backend | Node.js, Express 4, MongoDB (Mongoose) |
| Auth | JWT (jwt-simple) + bcrypt |
| Database | MongoDB Atlas |

## Project Structure

```
ubicasure/
├── back/           # Express REST API (port 3200)
│   ├── configs/    # App setup and MongoDB connection
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/   # JWT and auth middleware
│   │   └── utils/
│   └── index.js
├── front/          # Angular 14 SPA (port 4200)
│   └── src/app/
│       ├── components/ # 14 route components
│       ├── guards/
│       ├── models/
│       └── services/
├── .env.example    # Environment variable template
└── package.json    # Root scripts (runs both with concurrently)
```

## Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI: `npm install -g @angular/cli@14`
- A MongoDB Atlas cluster
- A Google Maps API key with Maps JavaScript API and Places API enabled

## Setup

**1. Clone and install dependencies**

```bash
git clone <repo-url>
cd ubicasure
npm run install:all
```

**2. Configure environment variables**

Copy `.env.example` to `.env` in `back/` and fill in your values:

```bash
cp .env.example back/.env
```

Update `back/configs/mongoConfigs.js` to read `process.env.MONGO_URI` and `back/src/services/jwt.js` to read `process.env.JWT_SECRET`.

Update `front/src/environments/environment.ts` with your Firebase and Google Maps keys.

**3. Run in development**

```bash
npm run dev          # Starts both backend (3200) and frontend (4200) concurrently
npm run dev:back     # Backend only
npm run dev:front    # Frontend only
```

## API Endpoints

All station endpoints require an `Authorization: <token>` header.

### Auth (`/user`)

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/user/register` | Public | Register a new user |
| POST | `/user/login` | Public | Login, returns JWT |

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

## Deployment

### Backend (current: Heroku — needs migration)

See `update-plan.md` for the recommended migration to Railway or Render.

```bash
npm start   # Runs node index.js from back/
```

### Frontend (Firebase Hosting)

```bash
cd front
ng build                     # Outputs to dist/map
firebase deploy              # Deploy to Firebase Hosting
```

## Known Issues / Limitations

- MongoDB URI, JWT secret, and API keys are currently hardcoded — see `update-plan.md`
- Backend is deployed on Heroku's free tier which was discontinued in November 2022
- Station coordinates are restricted to the San Salvador metropolitan area
- `bcrypt-nodejs` is unmaintained; replacement is tracked in `update-plan.md`

## Contributing

See `update-plan.md` for the prioritized list of improvements before adding new features.
